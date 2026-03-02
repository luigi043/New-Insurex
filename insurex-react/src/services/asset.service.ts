import api from './api';
import {
  Asset,
  AssetFilter,
  CreateAssetData,
  UpdateAssetData,
  AssetStats,
  AssetValuation,
  AssetMaintenance,
} from '../types/asset.types';
import { PaginatedResponse } from '../types/policy.types';

export const assetService = {
  // Get all assets with pagination and filters
  async getAssets(
    page: number = 1,
    pageSize: number = 10,
    filters?: AssetFilter
  ): Promise<PaginatedResponse<Asset>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.ownerId && { ownerId: filters.ownerId }),
      ...(filters?.minValue && { minValue: filters.minValue.toString() }),
      ...(filters?.maxValue && { maxValue: filters.maxValue.toString() }),
      ...(filters?.location && { location: filters.location }),
    });

    const response = await api.get<PaginatedResponse<Asset>>(`/assets?${params}`);
    return response.data;
  },

  // Get a single asset by ID
  async getAsset(id: string): Promise<Asset> {
    const response = await api.get<Asset>(`/assets/${id}`);
    return response.data;
  },

  // Get asset by asset ID (custom identifier)
  async getAssetByAssetId(assetId: string): Promise<Asset> {
    const response = await api.get<Asset>(`/assets/asset-id/${assetId}`);
    return response.data;
  },

  // Create a new asset
  async createAsset(data: CreateAssetData): Promise<Asset> {
    const response = await api.post<Asset>('/assets', data);
    return response.data;
  },

  // Update an existing asset
  async updateAsset(id: string, data: UpdateAssetData): Promise<Asset> {
    const response = await api.put<Asset>(`/assets/${id}`, data);
    return response.data;
  },

  // Delete an asset
  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  // Get asset statistics
  async getAssetStats(): Promise<AssetStats> {
    const response = await api.get<AssetStats>('/assets/stats');
    return response.data;
  },

  // Get assets by owner
  async getAssetsByOwner(ownerId: string): Promise<Asset[]> {
    const response = await api.get<Asset[]>(`/assets/owner/${ownerId}`);
    return response.data;
  },

  // Get assets by policy
  async getAssetsByPolicy(policyId: string): Promise<Asset[]> {
    const response = await api.get<Asset[]>(`/assets/policy/${policyId}`);
    return response.data;
  },

  // Link asset to policy
  async linkToPolicy(assetId: string, policyId: string, coverageAmount: number): Promise<void> {
    await api.post(`/assets/${assetId}/policies`, { policyId, coverageAmount });
  },

  // Unlink asset from policy
  async unlinkFromPolicy(assetId: string, policyId: string): Promise<void> {
    await api.delete(`/assets/${assetId}/policies/${policyId}`);
  },

  // Upload asset image
  async uploadImage(assetId: string, file: File, isPrimary: boolean = false): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrimary', isPrimary.toString());

    await api.post(`/assets/${assetId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete asset image
  async deleteImage(assetId: string, imageId: string): Promise<void> {
    await api.delete(`/assets/${assetId}/images/${imageId}`);
  },

  // Upload asset document
  async uploadDocument(assetId: string, file: File, name?: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }

    await api.post(`/assets/${assetId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete asset document
  async deleteDocument(assetId: string, documentId: string): Promise<void> {
    await api.delete(`/assets/${assetId}/documents/${documentId}`);
  },

  // Add asset valuation
  async addValuation(assetId: string, data: Omit<AssetValuation, 'id' | 'assetId'>): Promise<AssetValuation> {
    const response = await api.post<AssetValuation>(`/assets/${assetId}/valuations`, data);
    return response.data;
  },

  // Get asset valuations
  async getValuations(assetId: string): Promise<AssetValuation[]> {
    const response = await api.get<AssetValuation[]>(`/assets/${assetId}/valuations`);
    return response.data;
  },

  // Add maintenance record
  async addMaintenance(assetId: string, data: Omit<AssetMaintenance, 'id' | 'assetId'>): Promise<AssetMaintenance> {
    const response = await api.post<AssetMaintenance>(`/assets/${assetId}/maintenance`, data);
    return response.data;
  },

  // Get maintenance records
  async getMaintenance(assetId: string): Promise<AssetMaintenance[]> {
    const response = await api.get<AssetMaintenance[]>(`/assets/${assetId}/maintenance`);
    return response.data;
  },

  // Search assets
  async searchAssets(query: string): Promise<Asset[]> {
    const response = await api.get<Asset[]>(`/assets/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Bulk update assets
  async bulkUpdate(assetIds: string[], data: Partial<UpdateAssetData>): Promise<void> {
    await api.put('/assets/bulk', { assetIds, data });
  },

  // Bulk delete assets
  async bulkDelete(assetIds: string[]): Promise<void> {
    await api.post('/assets/bulk-delete', { assetIds });
  },

  // Export assets
  async exportAssets(format: 'csv' | 'excel' | 'pdf', filters?: AssetFilter): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.status && { status: filters.status }),
    });

    const response = await api.get(`/assets/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Import assets
  async importAssets(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/assets/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
