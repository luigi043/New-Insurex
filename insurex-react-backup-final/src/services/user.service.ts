import api from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  status: string;
  tenantId?: string;
}

export const userService = {
  // Get all users
  getUsers: (page: number = 1, pageSize: number = 10) => {
    return api.get(`/users?page=${page}&pageSize=${pageSize}`);
  },

  // Get user by ID
  getUser: (id: string) => {
    return api.get<User>(`/users/${id}`);
  },

  // Get users by role
  getUsersByRole: (role: string) => {
    return api.get<User[]>(`/users/role/${role}`);
  },

  // Create user
  createUser: (data: Partial<User>) => {
    return api.post<User>('/users', data);
  },

  // Update user
  updateUser: (id: string, data: Partial<User>) => {
    return api.put<User>(`/users/${id}`, data);
  },

  // Delete user
  deleteUser: (id: string) => {
    return api.delete(`/users/${id}`);
  },

  // Get current user profile
  getProfile: () => {
    return api.get<User>('/users/profile');
  },

  // Update profile
  updateProfile: (data: Partial<User>) => {
    return api.put<User>('/users/profile', data);
  }
};