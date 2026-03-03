import { apiClient } from '../../../services/api/client';
import { ApiResponse } from '../../../types/common.types';
import { TenantSettings } from '../types/admin.types';

const BASE_URL = '/api/tenant';

export const tenantService = {
  async getSettings(): Promise<TenantSettings> {
    const response = await apiClient.get<ApiResponse<TenantSettings>>(`${BASE_URL}/settings`);
    return response.data.data!;
  },

  async updateSettings(settings: TenantSettings): Promise<TenantSettings> {
    const response = await apiClient.put<ApiResponse<TenantSettings>>(`${BASE_URL}/settings`, settings);
    return response.data.data!;
  },

  async getStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalPolicies: number;
    totalClaims: number;
    totalPremium: number;
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalUsers: number;
      activeUsers: number;
      totalPolicies: number;
      totalClaims: number;
      totalPremium: number;
    }>>(`${BASE_URL}/stats`);
    return response.data.data!;
  }
};
