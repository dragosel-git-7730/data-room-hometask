// API interceptor for handling authentication tokens and responses
export class ApiInterceptor {
  private static instance: ApiInterceptor;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  public static getInstance(): ApiInterceptor {
    if (!ApiInterceptor.instance) {
      ApiInterceptor.instance = new ApiInterceptor();
    }
    return ApiInterceptor.instance;
  }

  // Enhanced fetch with automatic token handling
  async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry the original request with new token
          const newToken = localStorage.getItem('auth_token');
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              'Authorization': `Bearer ${newToken}`,
            },
          };
          const retryResponse = await fetch(url, retryConfig);
          if (!retryResponse.ok) {
            throw new Error('Request failed after token refresh');
          }
          return retryResponse.json();
        } else {
          // Refresh failed, redirect to login
          this.handleAuthFailure();
          throw new Error('Authentication required');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private handleAuthFailure(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Dispatch custom event for auth failure
    window.dispatchEvent(new CustomEvent('auth:failure'));
    
    // Redirect to login (if not already there)
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  // Helper methods for different HTTP methods
  async get<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method' | 'body'> = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options: Omit<RequestInit, 'method' | 'body'> = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: Omit<RequestInit, 'method'> = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = ApiInterceptor.getInstance();