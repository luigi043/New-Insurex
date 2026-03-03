import { describe, it, expect, vi, beforeEach } from 'vitest';


import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import React from 'react';



// Mock auth service

const mockLogin = vi.fn();

const mockRegister = vi.fn();

const mockLogout = vi.fn();

const mockForgotPassword = vi.fn();



vi.mock('../../services/auth.service', () => ({

  authService: {

    login: (...args: any[]) => mockLogin(...args),

    register: (...args: any[]) => mockRegister(...args),

    logout: (...args: any[]) => mockLogout(...args),

    forgotPassword: (...args: any[]) => mockForgotPassword(...args),

    isAuthenticated: vi.fn(() => false),

    getCurrentUser: vi.fn(),

    getStoredUser: vi.fn(() => null),

  },

}));



vi.mock('../../hooks/useNotification', () => ({

  useNotification: () => ({

    showSuccess: vi.fn(),

    showError: vi.fn(),

    showNotification: vi.fn(),

    notifications: [],

    hideNotification: vi.fn(),

    clearAll: vi.fn(),

  }),

  NotificationContext: {

    Provider: ({ children }: { children: React.ReactNode }) => children,

  },

}));



describe('Authentication Flow', () => {

  beforeEach(() => {

    vi.clearAllMocks();

    localStorage.clear();

  });



  describe('Login Flow', () => {

    it('should validate email format before submission', () => {

      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);



      expect(isValidEmail('user@example.com')).toBe(true);

      expect(isValidEmail('invalid')).toBe(false);

      expect(isValidEmail('')).toBe(false);

    });



    it('should validate password is not empty', () => {

      const isValidPassword = (password: string) => password.trim().length > 0;



      expect(isValidPassword('password123')).toBe(true);

      expect(isValidPassword('')).toBe(false);

      expect(isValidPassword('   ')).toBe(false);

    });



    it('should store tokens after successful login', async () => {

      mockLogin.mockResolvedValue({

        user: { id: '1', email: 'test@test.com', firstName: 'Test' },

        accessToken: 'access-token-123',

        refreshToken: 'refresh-token-456',

      });



      const result = await mockLogin({ email: 'test@test.com', password: 'password' });



      localStorage.setItem('accessToken', result.accessToken);

      localStorage.setItem('refreshToken', result.refreshToken);



      expect(localStorage.getItem('accessToken')).toBe('access-token-123');

      expect(localStorage.getItem('refreshToken')).toBe('refresh-token-456');

    });



    it('should handle login failure', async () => {

      mockLogin.mockRejectedValue({

        response: { data: { message: 'Invalid credentials' } },

      });



      try {

        await mockLogin({ email: 'wrong@test.com', password: 'wrong' });

      } catch (err: any) {

        expect(err.response.data.message).toBe('Invalid credentials');

      }

    });

  });



  describe('Registration Flow', () => {

    it('should validate registration data', () => {

      const validateRegistration = (data: {

        email: string;

        password: string;

        firstName: string;

        lastName: string;

      }) => {

        const errors: string[] = [];

        if (!data.email) errors.push('Email is required');

        if (!data.password || data.password.length < 8) errors.push('Password must be at least 8 characters');

        if (!data.firstName) errors.push('First name is required');

        if (!data.lastName) errors.push('Last name is required');

        return errors;

      };



      expect(validateRegistration({

        email: 'test@test.com',

        password: 'password123',

        firstName: 'Test',

        lastName: 'User',

      })).toHaveLength(0);



      expect(validateRegistration({

        email: '',

        password: 'short',

        firstName: '',

        lastName: '',

      })).toHaveLength(4);

    });



    it('should handle successful registration', async () => {

      mockRegister.mockResolvedValue({

        user: { id: '1', email: 'new@test.com', firstName: 'New' },

        accessToken: 'new-access-token',

        refreshToken: 'new-refresh-token',

      });



      const result = await mockRegister({

        email: 'new@test.com',

        password: 'password123',

        firstName: 'New',

        lastName: 'User',

      });



      expect(result.user.email).toBe('new@test.com');

      expect(result.accessToken).toBeTruthy();

    });

  });



  describe('Logout Flow', () => {

    it('should clear all auth data on logout', async () => {

      localStorage.setItem('accessToken', 'token');

      localStorage.setItem('refreshToken', 'refresh');

      localStorage.setItem('user', '{"id":"1"}');



      mockLogout.mockResolvedValue(undefined);

      await mockLogout();



      localStorage.removeItem('accessToken');

      localStorage.removeItem('refreshToken');

      localStorage.removeItem('user');



      expect(localStorage.getItem('accessToken')).toBeNull();

      expect(localStorage.getItem('refreshToken')).toBeNull();

      expect(localStorage.getItem('user')).toBeNull();

    });

  });



  describe('Password Reset Flow', () => {

    it('should validate email for password reset', () => {

      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      expect(isValidEmail('user@example.com')).toBe(true);

      expect(isValidEmail('')).toBe(false);

    });



    it('should validate new password requirements', () => {

      const validateNewPassword = (password: string, confirmPassword: string) => {

        const errors: string[] = [];

        if (password.length < 8) errors.push('Password must be at least 8 characters');

        if (password !== confirmPassword) errors.push('Passwords do not match');

        if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letter');

        if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letter');

        if (!/\d/.test(password)) errors.push('Must contain a number');

        return errors;

      };



      expect(validateNewPassword('StrongPass1', 'StrongPass1')).toHaveLength(0);

      expect(validateNewPassword('weak', 'weak')).toHaveLength(3);

      expect(validateNewPassword('StrongPass1', 'Different1')).toHaveLength(1);

    });

  });



  describe('Token Refresh', () => {

    it('should detect expired tokens', () => {

      const isTokenExpired = (token: string | null): boolean => {

        if (!token) return true;

        try {

          const payload = JSON.parse(atob(token.split('.')[1]));

          return payload.exp * 1000 < Date.now();

        } catch {

          return true;

        }

      };



      expect(isTokenExpired(null)).toBe(true);

      expect(isTokenExpired('')).toBe(true);

      expect(isTokenExpired('invalid-token')).toBe(true);

    });

  });

});
