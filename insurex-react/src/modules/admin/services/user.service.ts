import { apiClient } from '../../../services/api/client';
import { ApiResponse, PagedResult, PaginationRequest } from '../../../types/common.types';
import { User, UserRole, UserStatus } from '../../auth/types/auth.types';

interface UserFilterRequest extends PaginationRequest {
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
}

interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

const BASE_URL = '/api/users';

export const userService = {
  async getAll(request: PaginationRequest): Promise<PagedResult<User>> {
    const params = new URLSearchParams();
    params.append('page', request.page.toString());
    params.append('pageSize', request.pageSize.toString());
    if (request.sortBy) params.append('sortBy', request.sortBy);
    if (request.sortDescending !== undefined) params.append('sortDescending', request.sortDescending.toString());

    const response = await apiClient.get<ApiResponse<PagedResult<User>>>(`${BASE_URL}?${params.toString()}`);
    return response.data.data!;
  },

  async filter(request: UserFilterRequest): Promise<PagedResult<User>> {
    const params = new URLSearchParams();
    params.append('page', request.page.toString());
    params.append('pageSize', request.pageSize.toString());
    if (request.sortBy) params.append('sortBy', request.sortBy);
    if (request.sortDescending !== undefined) params.append('sortDescending', request.sortDescending.toString());
    if (request.searchTerm) params.append('searchTerm', request.searchTerm);
    if (request.role) params.append('role', request.role);
    if (request.status) params.append('status', request.status);

    const response = await apiClient.get<ApiResponse<PagedResult<User>>>(`${BASE_URL}/filter?${params.toString()}`);
    return response.data.data!;
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`${BASE_URL}/${id}`);
    return response.data.data!;
  },

  async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(BASE_URL, data);
    return response.data.data!;
  },

  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`${BASE_URL}/${id}`, data);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
  },

  async activate(id: number): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(`${BASE_URL}/${id}/activate`);
    return response.data.data!;
  },

  async deactivate(id: number, reason: string): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(`${BASE_URL}/${id}/deactivate`, { reason });
    return response.data.data!;
  },

  async resetPassword(id: number): Promise<{ temporaryPassword: string }> {
    const response = await apiClient.post<ApiResponse<{ temporaryPassword: string }>>(`${BASE_URL}/${id}/reset-password`);
    return response.data.data!;
  },

  async changeRole(id: number, role: UserRole): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(`${BASE_URL}/${id}/change-role`, { role });
    return response.data.data!;
  }
};
