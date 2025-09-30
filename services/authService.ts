// Authentication service for backend API integration
import { apiClient } from '@/utils/apiInterceptor';
import { mockBackend } from './mockBackend';
import { authValidation } from '@/utils/authValidation';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
}

// Check if we should use mock backend (no real backend available)
const USE_MOCK_BACKEND = typeof window !== 'undefined' && 
  process.env.NODE_ENV === 'development' && 
  !process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate input
    const validation = authValidation.validateLoginCredentials(credentials);
    if (!validation.isValid) {
      const errorMessage = validation.errors.map(e => e.message).join(', ');
      throw new Error(errorMessage);
    }

    if (USE_MOCK_BACKEND) {
      return mockBackend.login(credentials);
    }
    
    try {
      return await apiClient.post<AuthResponse>('/auth/login', credentials);
    } catch (error) {
      console.warn('Real API failed, falling back to mock:', error);
      return mockBackend.login(credentials);
    }
  },

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    // Validate input
    const validation = authValidation.validateRegistrationData(userData);
    if (!validation.isValid) {
      const errorMessage = validation.errors.map(e => e.message).join(', ');
      throw new Error(errorMessage);
    }

    if (USE_MOCK_BACKEND) {
      return mockBackend.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
    }

    try {
      return await apiClient.post<AuthResponse>('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      console.warn('Real API failed, falling back to mock:', error);
      return mockBackend.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
    }
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    if (USE_MOCK_BACKEND) {
      // Mock doesn't need refresh, just validate current token
      const user = await mockBackend.validateToken();
      return {
        token: `mock_token_${user.id}_${Date.now()}`,
        user,
      };
    }

    return apiClient.post<AuthResponse>('/auth/refresh');
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      if (!USE_MOCK_BACKEND) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  },

  // Validate token
  async validateToken(token: string): Promise<AuthResponse['user']> {
    if (USE_MOCK_BACKEND) {
      return mockBackend.validateToken();
    }

    try {
      return await apiClient.get<AuthResponse['user']>('/auth/validate');
    } catch (error) {
      console.warn('Token validation failed, falling back to mock:', error);
      return mockBackend.validateToken();
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<AuthResponse['user']> {
    if (USE_MOCK_BACKEND) {
      return mockBackend.validateToken();
    }

    try {
      return await apiClient.get<AuthResponse['user']>('/auth/me');
    } catch (error) {
      console.warn('Get user failed, falling back to mock:', error);
      return mockBackend.validateToken();
    }
  },

  // Demo mode fallback (for development)
  async demoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const demoUsers = {
      'admin@dataroom.com': {
        id: '1',
        name: 'Admin User',
        email: 'admin@dataroom.com',
        role: 'admin',
        password: 'admin123',
      },
      'user@dataroom.com': {
        id: '2',
        name: 'Regular User',
        email: 'user@dataroom.com',
        role: 'user',
        password: 'user123',
      },
      'viewer@dataroom.com': {
        id: '3',
        name: 'Viewer User',
        email: 'viewer@dataroom.com',
        role: 'viewer',
        password: 'viewer123',
      },
    };

    const user = demoUsers[credentials.email as keyof typeof demoUsers];
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const token = `demo_token_${user.id}_${Date.now()}`;
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};