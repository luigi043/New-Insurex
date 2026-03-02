import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Mock response
    return {
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      user: {
        id: '1',
        email: data.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'Admin',
        status: 'Active'
      }
    };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return {
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      user: {
        id: '2',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: 'Active'
      }
    };
  },

  logout(): void {
    localStorage.clear();
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};
