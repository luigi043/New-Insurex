import { apiClient } from '../../../services/api/client';
import { ApiResponse } from '../../../types/common.types';
import {
  Partner,
  PartnerListItem,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnerFilterRequest,
  PartnerStatistics,
  PartnerPolicy,
  PartnerCommission,
  PartnerCommissionSummary,
  PartnerActivity,
  ActivatePartnerRequest,
  DeactivatePartnerRequest,
  PartnerType,
  PartnerStatus
} from '../types/partner.types';
import { PagedResult, PaginationRequest } from '../../../types/common.types';

const BASE_URL = '/api/partners';

export const partnerService = {
  // CRUD Operations
  async getAll(request: PaginationRequest): Promise<PagedResult<PartnerListItem>> {
    const params = new URLSearchParams();
    params.append('page', request.page.toString());
    params.append('pageSize', request.pageSize.toString());
    if (request.sortBy) params.append('sortBy', request.sortBy);
    if (request.sortDescending !== undefined) params.append('sortDescending', request.sortDescending.toString());

    const response = await apiClient.get<ApiResponse<PagedResult<PartnerListItem>>>(`${BASE_URL}?${params.toString()}`);
    return response.data.data!;
  },

  async filter(request: PartnerFilterRequest): Promise<PagedResult<PartnerListItem>> {
    const params = new URLSearchParams();
    params.append('page', request.page.toString());
    params.append('pageSize', request.pageSize.toString());
    if (request.sortBy) params.append('sortBy', request.sortBy);
    if (request.sortDescending !== undefined) params.append('sortDescending', request.sortDescending.toString());
    if (request.searchTerm) params.append('searchTerm', request.searchTerm);
    if (request.type) params.append('type', request.type);
    if (request.status) params.append('status', request.status);
    if (request.country) params.append('country', request.country);
    if (request.city) params.append('city', request.city);
    if (request.minCommissionRate !== undefined) params.append('minCommissionRate', request.minCommissionRate.toString());
    if (request.maxCommissionRate !== undefined) params.append('maxCommissionRate', request.maxCommissionRate.toString());

    const response = await apiClient.get<ApiResponse<PagedResult<PartnerListItem>>>(`${BASE_URL}/filter?${params.toString()}`);
    return response.data.data!;
  },

  async getById(id: number): Promise<Partner> {
    const response = await apiClient.get<ApiResponse<Partner>>(`${BASE_URL}/${id}`);
    return response.data.data!;
  },

  async create(data: CreatePartnerRequest): Promise<Partner> {
    const response = await apiClient.post<ApiResponse<Partner>>(BASE_URL, data);
    return response.data.data!;
  },

  async update(id: number, data: UpdatePartnerRequest): Promise<Partner> {
    const response = await apiClient.put<ApiResponse<Partner>>(`${BASE_URL}/${id}`, data);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
  },

  // Status Management
  async activate(id: number, data?: ActivatePartnerRequest): Promise<Partner> {
    const response = await apiClient.post<ApiResponse<Partner>>(`${BASE_URL}/${id}/activate`, data || {});
    return response.data.data!;
  },

  async deactivate(id: number, data: DeactivatePartnerRequest): Promise<Partner> {
    const response = await apiClient.post<ApiResponse<Partner>>(`${BASE_URL}/${id}/deactivate`, data);
    return response.data.data!;
  },

  // Statistics and Analytics
  async getStatistics(): Promise<PartnerStatistics> {
    const response = await apiClient.get<ApiResponse<PartnerStatistics>>(`${BASE_URL}/statistics`);
    return response.data.data!;
  },

  async getPartnerStatistics(id: number): Promise<{
    totalPolicies: number;
    totalPremium: number;
    totalCommission: number;
    activePolicies: number;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalPolicies: number;
      totalPremium: number;
      totalCommission: number;
      activePolicies: number;
    }>>(`${BASE_URL}/${id}/statistics`);
    return response.data.data!;
  },

  // Policies and Commissions
  async getPartnerPolicies(id: number): Promise<PartnerPolicy[]> {
    const response = await apiClient.get<ApiResponse<PartnerPolicy[]>>(`${BASE_URL}/${id}/policies`);
    return response.data.data!;
  },

  async getPartnerCommissions(id: number): Promise<PartnerCommission[]> {
    const response = await apiClient.get<ApiResponse<PartnerCommission[]>>(`${BASE_URL}/${id}/commissions`);
    return response.data.data!;
  },

  async getCommissionSummary(id: number): Promise<PartnerCommissionSummary> {
    const response = await apiClient.get<ApiResponse<PartnerCommissionSummary>>(`${BASE_URL}/${id}/commissions/summary`);
    return response.data.data!;
  },

  // Activities
  async getPartnerActivities(id: number): Promise<PartnerActivity[]> {
    const response = await apiClient.get<ApiResponse<PartnerActivity[]>>(`${BASE_URL}/${id}/activities`);
    return response.data.data!;
  },

  // Lookup Data
  async getPartnerTypes(): Promise<PartnerType[]> {
    return Object.values(PartnerType);
  },

  async getPartnerStatuses(): Promise<PartnerStatus[]> {
    return Object.values(PartnerStatus);
  },

  // Search
  async search(query: string, limit: number = 10): Promise<PartnerListItem[]> {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('limit', limit.toString());

    const response = await apiClient.get<ApiResponse<PartnerListItem[]>>(`${BASE_URL}/search?${params.toString()}`);
    return response.data.data!;
  },

  // Bulk Operations
  async bulkActivate(ids: number[]): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${BASE_URL}/bulk/activate`, { ids });
  },

  async bulkDeactivate(ids: number[], reason: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${BASE_URL}/bulk/deactivate`, { ids, reason });
  },

  // Export
  async exportToExcel(filter?: PartnerFilterRequest): Promise<Blob> {
    const params = new URLSearchParams();
    if (filter?.type) params.append('type', filter.type);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.country) params.append('country', filter.country);

    const response = await apiClient.get(`${BASE_URL}/export/excel?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async exportToCsv(filter?: PartnerFilterRequest): Promise<Blob> {
    const params = new URLSearchParams();
    if (filter?.type) params.append('type', filter.type);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.country) params.append('country', filter.country);

    const response = await apiClient.get(`${BASE_URL}/export/csv?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
