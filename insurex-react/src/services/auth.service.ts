import api from './api';
import { 
  User, 
  LoginCredentials, 
  LoginResponse, 
  RegisterData, 
  RegisterResponse,
  PasswordChangeData 
} from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword });
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const data: PasswordChangeData = { oldPassword, newPassword };
    await api.post('/auth/change-password', data);
  },

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  },

  async resendVerificationEmail(email: string): Promise<void> {
    await api.post('/auth/resend-verification', { email });
  },
};
