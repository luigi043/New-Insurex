import api from './api';
import {
  Claim,
  ClaimFilter,
  CreateClaimData,
  UpdateClaimData,
  ClaimStats,
  ClaimWorkflowAction,
  ClaimNote,
  ClaimPayment,
} from '../types/claim.types';
import { PaginatedResponse } from '../types/policy.types';

export const claimService = {
  // Get all claims with pagination and filters
  async getClaims(
    page: number = 1,
    pageSize: number = 10,
    filters?: ClaimFilter
  ): Promise<PaginatedResponse<Claim>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.policyId && { policyId: filters.policyId }),
      ...(filters?.claimantId && { claimantId: filters.claimantId }),
      ...(filters?.assignedTo && { assignedTo: filters.assignedTo }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
      ...(filters?.minAmount && { minAmount: filters.minAmount.toString() }),
      ...(filters?.maxAmount && { maxAmount: filters.maxAmount.toString() }),
    });

    const response = await api.get<PaginatedResponse<Claim>>(`/claims?${params}`);
    return response.data;
  },

  // Get a single claim by ID
  async getClaim(id: string): Promise<Claim> {
    const response = await api.get<Claim>(`/claims/${id}`);
    return response.data;
  },

  // Get claim by claim number
  async getClaimByNumber(claimNumber: string): Promise<Claim> {
    const response = await api.get<Claim>(`/claims/number/${claimNumber}`);
    return response.data;
  },

  // Create a new claim
  async createClaim(data: CreateClaimData): Promise<Claim> {
    const response = await api.post<Claim>('/claims', data);
    return response.data;
  },

  // Update an existing claim
  async updateClaim(id: string, data: UpdateClaimData): Promise<Claim> {
    const response = await api.put<Claim>(`/claims/${id}`, data);
    return response.data;
  },

  // Delete a claim
  async deleteClaim(id: string): Promise<void> {
    await api.delete(`/claims/${id}`);
  },

  // Get claim statistics
  async getClaimStats(): Promise<ClaimStats> {
    const response = await api.get<ClaimStats>('/claims/stats');
    return response.data;
  },

  // Get claims by policy
  async getClaimsByPolicy(policyId: string): Promise<Claim[]> {
    const response = await api.get<Claim[]>(`/claims/policy/${policyId}`);
    return response.data;
  },

  // Get claims by claimant
  async getClaimsByClaimant(claimantId: string): Promise<Claim[]> {
    const response = await api.get<Claim[]>(`/claims/claimant/${claimantId}`);
    return response.data;
  },

  // Get claims assigned to user
  async getAssignedClaims(userId: string): Promise<Claim[]> {
    const response = await api.get<Claim[]>(`/claims/assigned/${userId}`);
    return response.data;
  },

  // Submit a claim
  async submitClaim(id: string): Promise<Claim> {
    const response = await api.post<Claim>(`/claims/${id}/submit`);
    return response.data;
  },

  // Workflow actions
  async workflowAction(id: string, action: ClaimWorkflowAction): Promise<Claim> {
    const response = await api.post<Claim>(`/claims/${id}/workflow`, action);
    return response.data;
  },

  // Assign claim to user
  async assignClaim(id: string, userId: string): Promise<Claim> {
    const response = await api.post<Claim>(`/claims/${id}/assign`, { userId });
    return response.data;
  },

  // Add note to claim
  async addNote(id: string, content: string, isInternal: boolean = false): Promise<ClaimNote> {
    const response = await api.post<ClaimNote>(`/claims/${id}/notes`, { content, isInternal });
    return response.data;
  },

  // Get claim notes
  async getNotes(id: string): Promise<ClaimNote[]> {
    const response = await api.get<ClaimNote[]>(`/claims/${id}/notes`);
    return response.data;
  },

  // Add payment to claim
  async addPayment(id: string, data: Omit<ClaimPayment, 'id'>): Promise<ClaimPayment> {
    const response = await api.post<ClaimPayment>(`/claims/${id}/payments`, data);
    return response.data;
  },

  // Get claim payments
  async getPayments(id: string): Promise<ClaimPayment[]> {
    const response = await api.get<ClaimPayment[]>(`/claims/${id}/payments`);
    return response.data;
  },

  // Upload claim document
  async uploadDocument(id: string, file: File, name?: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }

    await api.post(`/claims/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete claim document
  async deleteDocument(claimId: string, documentId: string): Promise<void> {
    await api.delete(`/claims/${claimId}/documents/${documentId}`);
  },

  // Search claims
  async searchClaims(query: string): Promise<Claim[]> {
    const response = await api.get<Claim[]>(`/claims/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get pending claims count
  async getPendingCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/claims/pending-count');
    return response.data.count;
  },

  // Export claims
  async exportClaims(format: 'csv' | 'excel' | 'pdf', filters?: ClaimFilter): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.type && { type: filters.type }),
    });

    const response = await api.get(`/claims/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
