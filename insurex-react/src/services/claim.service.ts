import apiClient from './api.service';
import {
  Claim,
  ClaimStatus,
  ClaimDocument,
  CreateClaimData,
  UpdateClaimData,
  ClaimFilters,
  ClaimStats,
  ClaimHistory
} from '../types/claim.types';
import { PaginatedResponse } from './policy.service';

class ClaimService {
  async getAll(filters?: ClaimFilters, page = 1, limit = 10): Promise<PaginatedResponse<Claim>> {
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

    const response = await apiClient.get<PaginatedResponse<Claim>>(`/claims?${params.toString()}`);
    return response.data;
  }

  async getClaims(page = 1, limit = 10, filters?: ClaimFilters): Promise<PaginatedResponse<Claim>> {
    return this.getAll(filters, page, limit);
  }

  async getById(id: string): Promise<Claim> {
    const response = await apiClient.get<Claim>(`/claims/${id}`);
    return response.data;
  }

  async getClaim(id: string): Promise<Claim> {
    return this.getById(id);
  }

  async create(data: CreateClaimData): Promise<Claim> {
    const response = await apiClient.post<Claim>('/claims', data);
    return response.data;
  }

  async update(id: string, data: UpdateClaimData): Promise<Claim> {
    const response = await apiClient.patch<Claim>(`/claims/${id}`, data);
    return response.data;
  }

  async updateClaimStatus(id: string, status: ClaimStatus, notes?: string): Promise<Claim> {
    return this.update(id, { status, notes });
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/claims/${id}`);
  }

  async getStats(): Promise<ClaimStats> {
    const response = await apiClient.get<ClaimStats>('/claims/stats');
    const stats = response.data;
    const pendingClaims = stats.byStatus?.SUBMITTED || stats.byStatus?.UNDER_REVIEW || 0;
    return {
      ...stats,
      totalClaims: stats.total,
      pendingClaims
    };
  }

  async getClaimStats(): Promise<ClaimStats> {
    return this.getStats();
  }

  async getHistory(id: string): Promise<ClaimHistory[]> {
    const response = await apiClient.get<ClaimHistory[]>(`/claims/${id}/history`);
    return response.data;
  }

  async submit(id: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/submit`);
    return response.data;
  }

  async approve(id: string, approvedAmount: number, notes?: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/approve`, { approvedAmount, notes });
    return response.data;
  }

  async reject(id: string, reason: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/reject`, { reason });
    return response.data;
  }

  async requestInfo(id: string, message: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/request-info`, { message });
    return response.data;
  }

  async settle(id: string, settlementAmount: number, notes?: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/settle`, { settlementAmount, notes });
    return response.data;
  }

  async assign(id: string, userId: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/assign`, { userId });
    return response.data;
  }

  async uploadDocument(id: string, file: File, name: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    await apiClient.post(`/claims/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteDocument(id: string, documentId: string): Promise<void> {
    await apiClient.delete(`/claims/${id}/documents/${documentId}`);
  }

  async getDocuments(id: string): Promise<ClaimDocument[]> {
    const claim = await this.getById(id);
    return claim.documents || [];
  }
}

export const claimService = new ClaimService();
