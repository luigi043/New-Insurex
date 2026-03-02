import apiClient from './api.service';
import { 
  Policy, 
  CreatePolicyData, 
  UpdatePolicyData, 
  PolicyFilters, 
  PolicyStats 
} from '../types/policy.types';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class PolicyService {
  async getAll(filters?: PolicyFilters, page = 1, limit = 10): Promise<PaginatedResponse<Policy>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await apiClient.get<PaginatedResponse<Policy>>(`/policies?${params.toString()}`);
    return response.data;
  }

  async getById(id: string): Promise<Policy> {
    const response = await apiClient.get<Policy>(`/policies/${id}`);
    return response.data;
  }

  async create(data: CreatePolicyData): Promise<Policy> {
    const response = await apiClient.post<Policy>('/policies', data);
    return response.data;
  }

  async update(id: string, data: UpdatePolicyData): Promise<Policy> {
    const response = await apiClient.patch<Policy>(`/policies/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/policies/${id}`);
  }

  async getStats(): Promise<PolicyStats> {
    const response = await apiClient.get<PolicyStats>('/policies/stats');
    return response.data;
  }

  async getByHolder(holderId: string): Promise<Policy[]> {
    const response = await apiClient.get<Policy[]>(`/policies/holder/${holderId}`);
    return response.data;
  }

  async getByAgent(agentId: string): Promise<Policy[]> {
    const response = await apiClient.get<Policy[]>(`/policies/agent/${agentId}`);
    return response.data;
  }

  async renew(id: string, data: Partial<CreatePolicyData>): Promise<Policy> {
    const response = await apiClient.post<Policy>(`/policies/${id}/renew`, data);
    return response.data;
  }

  async cancel(id: string, reason?: string): Promise<Policy> {
    const response = await apiClient.post<Policy>(`/policies/${id}/cancel`, { reason });
    return response.data;
  }

  async uploadDocument(id: string, file: File, name: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    
    await apiClient.post(`/policies/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteDocument(id: string, documentId: string): Promise<void> {
    await apiClient.delete(`/policies/${id}/documents/${documentId}`);
  }
}

export const policyService = new PolicyService();
