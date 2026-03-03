import apiClient from './api.service';
import {
  Partner,
  CreatePartnerData,
  UpdatePartnerData,
  PartnerFilters,
  PartnerStats,
  CommissionRate,
  PartnerContract,
  CreateCommissionRateData,
  CreateContractData
} from '../types/partner.types';
import { PaginatedResponse } from './policy.service';

class PartnerService {
  async getAll(filters?: PartnerFilters, page = 1, limit = 10): Promise<PaginatedResponse<Partner>> {
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

    const response = await apiClient.get<PaginatedResponse<Partner>>(`/partners?${params.toString()}`);
    return response.data;
  }

  async getById(id: string): Promise<Partner> {
    const response = await apiClient.get<Partner>(`/partners/${id}`);
    return response.data;
  }

  async create(data: CreatePartnerData): Promise<Partner> {
    const response = await apiClient.post<Partner>('/partners', data);
    return response.data;
  }

  async update(id: string, data: UpdatePartnerData): Promise<Partner> {
    const response = await apiClient.patch<Partner>(`/partners/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/partners/${id}`);
  }

  async getStats(): Promise<PartnerStats> {
    const response = await apiClient.get<PartnerStats>('/partners/stats');
    return response.data;
  }

  async activate(id: string): Promise<Partner> {
    const response = await apiClient.post<Partner>(`/partners/${id}/activate`);
    return response.data;
  }

  async deactivate(id: string, reason?: string): Promise<Partner> {
    const response = await apiClient.post<Partner>(`/partners/${id}/deactivate`, { reason });
    return response.data;
  }

  async uploadDocument(id: string, file: File, name: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    await apiClient.post(`/partners/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteDocument(id: string, documentId: string): Promise<void> {
    await apiClient.delete(`/partners/${id}/documents/${documentId}`);
  }

  async getCommissions(partnerId: string): Promise<CommissionRate[]> {
    const response = await apiClient.get<CommissionRate[]>(`/partners/${partnerId}/commissions`);
    return response.data;
  }

  async addCommission(data: CreateCommissionRateData): Promise<CommissionRate> {
    const response = await apiClient.post<CommissionRate>(`/partners/${data.partnerId}/commissions`, data);
    return response.data;
  }

  async getContracts(partnerId: string): Promise<PartnerContract[]> {
    const response = await apiClient.get<PartnerContract[]>(`/partners/${partnerId}/contracts`);
    return response.data;
  }

  async addContract(data: CreateContractData): Promise<PartnerContract> {
    const response = await apiClient.post<PartnerContract>(`/partners/${data.partnerId}/contracts`, data);
    return response.data;
  }
}

export const partnerService = new PartnerService();
