import api from './api';
import { Policy, PolicyFilter, PaginatedResponse } from '../types/policy.types';

export const policyService = {
  // Get all policies with pagination and filters
  getPolicies: (page: number = 1, pageSize: number = 10, filters?: PolicyFilter) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters as any,
    });
    return api.get<PaginatedResponse<Policy>>(`/policies?${params}`);
  },

  // Get single policy by ID
  getPolicy: (id: string) => {
    return api.get<Policy>(`/policies/${id}`);
  },

  // Create new policy
  createPolicy: (data: Partial<Policy>) => {
    return api.post<Policy>('/policies', data);
  },

  // Update policy
  updatePolicy: (id: string, data: Partial<Policy>) => {
    return api.put<Policy>(`/policies/${id}`, data);
  },

  // Delete policy
  deletePolicy: (id: string) => {
    return api.delete(`/policies/${id}`);
  },

  // Get policies by client
  getClientPolicies: (clientId: string, page: number = 1, pageSize: number = 10) => {
    return api.get<PaginatedResponse<Policy>>(`/policies/client/${clientId}`, {
      params: { page, pageSize }
    });
  },

  // Get policies by status
  getPoliciesByStatus: (status: string, page: number = 1, pageSize: number = 10) => {
    return api.get<PaginatedResponse<Policy>>(`/policies/status/${status}`, {
      params: { page, pageSize }
    });
  },

  // Get policy statistics
  getPolicyStats: () => {
    return api.get('/policies/stats/summary');
  }
};