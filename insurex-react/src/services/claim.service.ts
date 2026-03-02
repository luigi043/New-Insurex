import api from './api';
import { Claim, PaginatedResponse, ClaimStatus } from '../types/claim.types';

export const claimService = {
  async getClaims(
    page: number = 1,
    pageSize: number = 10,
    status?: ClaimStatus
  ): Promise<PaginatedResponse<Claim>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(status && { status }),
    });
    const response = await api.get<PaginatedResponse<Claim>>(`/claims?${params}`);
    return response.data;
  },

  async getClaim(id: string): Promise<Claim> {
    const response = await api.get<Claim>(`/claims/${id}`);
    return response.data;
  },

  async createClaim(data: any): Promise<Claim> {
    const response = await api.post<Claim>('/claims', data);
    return response.data;
  },

  async processClaim(id: string, data: any): Promise<Claim> {
    const response = await api.post<Claim>(`/claims/${id}/process`, data);
    return response.data;
  },

  async uploadDocument(claimId: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/claims/${claimId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
