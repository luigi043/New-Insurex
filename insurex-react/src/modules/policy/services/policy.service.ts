import apiClient from '../../../services/api.service';
import { Policy, PolicyListItem, CreatePolicyData, UpdatePolicyData, PolicyFilterRequest } from '../types/policy.types';
import { PagedResult } from '../../../types/common.types';
class PolicyService {
  async getAll(params: { page: number; pageSize: number }): Promise<PagedResult<PolicyListItem>> {
    const response = await apiClient.get('/policies', { params });
    return response.data?.data || response.data;
  }
  async filter(params: PolicyFilterRequest): Promise<PagedResult<PolicyListItem>> {
    const response = await apiClient.get('/policies/filter', { params });
    return response.data?.data || response.data;
  }
  async getById(id: number): Promise<Policy> {
    const response = await apiClient.get(`/policies/${id}`);
    return response.data?.data || response.data;
  }
  async create(data: CreatePolicyData): Promise<Policy> {
    const response = await apiClient.post('/policies', data);
    return response.data?.data || response.data;
  }
  async update(id: number, data: UpdatePolicyData): Promise<Policy> {
    const response = await apiClient.put(`/policies/${id}`, data);
    return response.data?.data || response.data;
  }
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/policies/${id}`);
  }
  async activate(id: number): Promise<Policy> {
    const response = await apiClient.post(`/policies/${id}/activate`);
    return response.data?.data || response.data;
  }
  async cancel(id: number, data: { cancellationReason: string }): Promise<Policy> {
    const response = await apiClient.post(`/policies/${id}/cancel`, { reason: data.cancellationReason });
    return response.data?.data || response.data;
  }
  async renew(id: number, newEndDate: string): Promise<Policy> {
    const response = await apiClient.post(`/policies/${id}/renew`, { newEndDate });
    return response.data?.data || response.data;
  }
  async getStatistics(): Promise<{ totalPolicies: number; activePolicies: number; totalPremium: number }> {
    const response = await apiClient.get('/policies/summary/totals');
    const data = response.data?.data || response.data;
    return {
      totalPolicies: data.activePolicyCount || 0,
      activePolicies: data.activePolicyCount || 0,
      totalPremium: data.totalPremium || 0,
    };
  }
}
export const policyService = new PolicyService();