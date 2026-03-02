import api from './api';
import { Policy, PolicyFilter, PaginatedResponse } from '../types/policy.types';

export const policyService = {
  async getPolicies(
    page: number = 1,
    pageSize: number = 10,
    filters?: PolicyFilter
  ): Promise<PaginatedResponse<Policy>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.search && { search: filters.search }),
    });
    const response = await api.get<PaginatedResponse<Policy>>(`/policies?${params}`);
    return response.data;
  },

  async getPolicy(id: string): Promise<Policy> {
    const response = await api.get<Policy>(`/policies/${id}`);
    return response.data;
  },

  async createPolicy(data: any): Promise<Policy> {
    const response = await api.post<Policy>('/policies', data);
    return response.data;
  },

  async updatePolicy(id: string, data: any): Promise<Policy> {
    const response = await api.put<Policy>(`/policies/${id}`, data);
    return response.data;
  },

  async deletePolicy(id: string): Promise<void> {
    await api.delete(`/policies/${id}`);
  },

  async getPolicyStats(): Promise<any> {
    const response = await api.get('/policies/stats');
    return response.data;
  },
};
