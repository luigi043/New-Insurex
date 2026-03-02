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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  status: UserStatus;
  tenantId?: string;
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
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}
