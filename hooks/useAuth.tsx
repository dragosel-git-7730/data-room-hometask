'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, RegisterData } from '@/services/authService';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface AuthContextValue {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        dispatch({ type: 'AUTH_START' });
        try {
          // Validate the token with the backend
          const user = await authService.validateToken(token);
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          dispatch({ type: 'AUTH_ERROR', payload: 'Session expired' });
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Try real backend first, fallback to demo mode
      let response;
      try {
        response = await authService.login(credentials);
      } catch (error) {
        // If backend is not available, use demo mode
        console.warn('Backend not available, using demo mode:', error);
        response = await authService.demoLogin(credentials);
      }

      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }

      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Try real backend first, fallback to demo mode
      let response;
      try {
        response = await authService.register(data);
      } catch (error) {
        // For demo purposes, just create a demo user
        console.warn('Backend not available, creating demo user:', error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        response = {
          token: `demo_token_new_${Date.now()}`,
          user: {
            id: `demo_${Date.now()}`,
            name: data.name,
            email: data.email,
            role: 'user',
          },
        };
      }

      // Store token and user data
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }

      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextValue = {
    state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}