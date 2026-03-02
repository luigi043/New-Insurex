import api from './api';
import { 
  Policy, 
  PolicyFilter, 
  CreatePolicyData, 
  UpdatePolicyData,
  PolicyStats,
  PaginatedResponse,
  PolicyRenewalData,
  PolicyCancellationData
} from '../types/policy.types';

export const policyService = {
  // Get all policies with pagination and filters
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
      ...(filters?.holderId && { holderId: filters.holderId }),
      ...(filters?.startDateFrom && { startDateFrom: filters.startDateFrom }),
      ...(filters?.startDateTo && { startDateTo: filters.startDateTo }),
      ...(filters?.endDateFrom && { endDateFrom: filters.endDateFrom }),
      ...(filters?.endDateTo && { endDateTo: filters.endDateTo }),
      ...(filters?.minPremium && { minPremium: filters.minPremium.toString() }),
      ...(filters?.maxPremium && { maxPremium: filters.maxPremium.toString() }),
    });
    
    const response = await api.get<PaginatedResponse<Policy>>(`/policies?${params}`);
    return response.data;
  },

  // Get a single policy by ID
  async getPolicy(id: string): Promise<Policy> {
    const response = await api.get<Policy>(`/policies/${id}`);
    return response.data;
  },

  // Get policy by policy number
  async getPolicyByNumber(policyNumber: string): Promise<Policy> {
    const response = await api.get<Policy>(`/policies/number/${policyNumber}`);
    return response.data;
  },

  // Create a new policy
  async createPolicy(data: CreatePolicyData): Promise<Policy> {
    const response = await api.post<Policy>('/policies', data);
    return response.data;
  },

  // Update an existing policy
  async updatePolicy(id: string, data: UpdatePolicyData): Promise<Policy> {
    const response = await api.put<Policy>(`/policies/${id}`, data);
    return response.data;
  },

  // Delete a policy
  async deletePolicy(id: string): Promise<void> {
    await api.delete(`/policies/${id}`);
  },

  // Get policy statistics
  async getPolicyStats(): Promise<PolicyStats> {
    const response = await api.get<PolicyStats>('/policies/stats');
    return response.data;
  },

  // Get policy statistics for a specific user
  async getPolicyStatsByUser(userId: string): Promise<PolicyStats> {
    const response = await api.get<PolicyStats>(`/policies/stats/user/${userId}`);
    return response.data;
  },

  // Renew a policy
  async renewPolicy(id: string, data: PolicyRenewalData): Promise<Policy> {
    const response = await api.post<Policy>(`/policies/${id}/renew`, data);
    return response.data;
  },

  // Cancel a policy
  async cancelPolicy(id: string, data: PolicyCancellationData): Promise<Policy> {
    const response = await api.post<Policy>(`/policies/${id}/cancel`, data);
    return response.data;
  },

  // Activate a pending policy
  async activatePolicy(id: string): Promise<Policy> {
    const response = await api.post<Policy>(`/policies/${id}/activate`);
    return response.data;
  },

  // Suspend an active policy
  async suspendPolicy(id: string, reason: string): Promise<Policy> {
    const response = await api.post<Policy>(`/policies/${id}/suspend`, { reason });
    return response.data;
  },

  // Get policies expiring soon
  async getExpiringPolicies(days: number = 30): Promise<Policy[]> {
    const response = await api.get<Policy[]>(`/policies/expiring?days=${days}`);
    return response.data;
  },

  // Get policies by holder
  async getPoliciesByHolder(holderId: string): Promise<Policy[]> {
    const response = await api.get<Policy[]>(`/policies/holder/${holderId}`);
    return response.data;
  },

  // Add document to policy
  async addPolicyDocument(policyId: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    await api.post(`/policies/${policyId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Remove document from policy
  async removePolicyDocument(policyId: string, documentId: string): Promise<void> {
    await api.delete(`/policies/${policyId}/documents/${documentId}`);
  },

  // Link asset to policy
  async linkAsset(policyId: string, assetId: string, coverageAmount: number): Promise<void> {
    await api.post(`/policies/${policyId}/assets`, { assetId, coverageAmount });
  },

  // Unlink asset from policy
  async unlinkAsset(policyId: string, assetId: string): Promise<void> {
    await api.delete(`/policies/${policyId}/assets/${assetId}`);
  },

  // Clone a policy
  async clonePolicy(id: string, modifications?: Partial<CreatePolicyData>): Promise<Policy> {
    const response = await api.post<Policy>(`/policies/${id}/clone`, modifications || {});
    return response.data;
  },

  // Search policies
  async searchPolicies(query: string): Promise<Policy[]> {
    const response = await api.get<Policy[]>(`/policies/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
