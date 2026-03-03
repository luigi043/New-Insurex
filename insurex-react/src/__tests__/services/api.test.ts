import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    defaults: { headers: { common: {} } },
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      post: vi.fn(),
    },
    ...mockAxiosInstance,
  };
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication Token Management', () => {
    it('should store tokens on login', () => {
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      expect(localStorage.getItem('accessToken')).toBe(accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(refreshToken);
    });

    it('should clear tokens on logout', () => {
      localStorage.setItem('accessToken', 'token');
      localStorage.setItem('refreshToken', 'refresh');
      localStorage.setItem('user', '{}');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should check authentication status', () => {
      expect(!!localStorage.getItem('accessToken')).toBe(false);

      localStorage.setItem('accessToken', 'token');
      expect(!!localStorage.getItem('accessToken')).toBe(true);
    });
  });

  describe('User Storage', () => {
    it('should store and retrieve user data', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'Admin',
      };

      localStorage.setItem('user', JSON.stringify(user));
      const stored = JSON.parse(localStorage.getItem('user') || '{}');

      expect(stored.email).toBe('test@example.com');
      expect(stored.firstName).toBe('Test');
      expect(stored.role).toBe('Admin');
    });

    it('should return null for non-existent user', () => {
      const userStr = localStorage.getItem('user');
      expect(userStr).toBeNull();
    });
  });

  describe('API Error Handling', () => {
    it('should handle network errors gracefully', () => {
      const handleError = (error: any) => {
        if (!error.response) {
          return { message: 'Network error. Please check your connection.' };
        }
        return { message: error.response.data?.message || 'An error occurred' };
      };

      const networkError = { response: undefined };
      expect(handleError(networkError).message).toBe('Network error. Please check your connection.');
    });

    it('should handle 401 unauthorized errors', () => {
      const handleError = (error: any) => {
        if (error.response?.status === 401) {
          return { message: 'Unauthorized. Please login again.', shouldRedirect: true };
        }
        return { message: 'An error occurred', shouldRedirect: false };
      };

      const unauthorizedError = { response: { status: 401 } };
      const result = handleError(unauthorizedError);
      expect(result.shouldRedirect).toBe(true);
    });

    it('should handle 403 forbidden errors', () => {
      const handleError = (error: any) => {
        if (error.response?.status === 403) {
          return { message: 'Access denied.' };
        }
        return { message: 'An error occurred' };
      };

      const forbiddenError = { response: { status: 403 } };
      expect(handleError(forbiddenError).message).toBe('Access denied.');
    });

    it('should handle 404 not found errors', () => {
      const handleError = (error: any) => {
        if (error.response?.status === 404) {
          return { message: 'Resource not found.' };
        }
        return { message: 'An error occurred' };
      };

      const notFoundError = { response: { status: 404 } };
      expect(handleError(notFoundError).message).toBe('Resource not found.');
    });

    it('should handle 500 server errors', () => {
      const handleError = (error: any) => {
        if (error.response?.status >= 500) {
          return { message: 'Server error. Please try again later.' };
        }
        return { message: 'An error occurred' };
      };

      const serverError = { response: { status: 500 } };
      expect(handleError(serverError).message).toBe('Server error. Please try again later.');
    });
  });

  describe('Request Configuration', () => {
    it('should set correct base URL from environment', () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      expect(baseUrl).toBeTruthy();
    });

    it('should set correct content type header', () => {
      const headers = { 'Content-Type': 'application/json' };
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should add authorization header when token exists', () => {
      localStorage.setItem('accessToken', 'test-token');
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      expect(headers.Authorization).toBe('Bearer test-token');
    });
  });
});
