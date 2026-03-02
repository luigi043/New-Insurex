export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId?: string;
  tenantCode?: string;
  phoneNumber?: string;
  status: UserStatus;
  createdAt: string;
}

export enum UserRole {
  Admin = 'Admin',
  Client = 'Client',
  Financer = 'Financer',
  Insurer = 'Insurer',
  Broker = 'Broker'
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
  PendingVerification = 'PendingVerification'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  tenantId?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}
