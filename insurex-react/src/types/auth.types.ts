export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  phone?: string;
  avatar?: string;
  isTwoFactorEnabled?: boolean;
  document?: string;
  position?: string;
  department?: string;
  company?: string;
}

export enum UserRole {
  Admin = 'Admin',
  Insurer = 'Insurer',
  Broker = 'Broker',
  Viewer = 'Viewer',
  Underwriter = 'Underwriter',
  ClaimsProcessor = 'ClaimsProcessor',
  Accountant = 'Accountant',
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
  company?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isTwoFactorEnabled?: boolean;
  document?: string;
  position?: string;
  department?: string;
  company?: string;
}