import { api, handleApiResponse } from './api';
import { User, UserProfile } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  username: string;
  preferred_language?: 'en' | 'ar';
  company?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  profile?: UserProfile;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('auth/login/', credentials);
    const data = handleApiResponse(response);
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('auth/register/', userData);
    const data = handleApiResponse(response);
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('auth/logout/');
    } catch (error) {
      // Even if logout fails on server, remove token locally
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('auth/user/');
    return handleApiResponse(response);
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.patch('auth/user/', updates);
    return handleApiResponse(response);
  },

  // Get user profile details
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await api.get('auth/profile/');
    return handleApiResponse(response);
  },

  // Update user profile details
  updateUserProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('auth/profile/', updates);
    return handleApiResponse(response);
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('auth/password-reset/', { email });
    return handleApiResponse(response);
  },

  // Confirm password reset
  confirmPasswordReset: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.post('auth/password-reset-confirm/', {
      token,
      password,
    });
    return handleApiResponse(response);
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.post('auth/verify-email/', { token });
    return handleApiResponse(response);
  },

  // Resend verification email
  resendVerificationEmail: async (): Promise<{ message: string }> => {
    const response = await api.post('auth/resend-verification/');
    return handleApiResponse(response);
  },
};