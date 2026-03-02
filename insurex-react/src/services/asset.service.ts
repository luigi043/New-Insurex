import apiClient from './api.service';
import { 
  Asset, 
  CreateAssetData, 
  UpdateAssetData, 
  AssetFilters, 
  AssetStats 
} from '../types/asset.types';
import { PaginatedResponse } from './policy.service';

class AssetService {
  async getAll(filters?: AssetFilters, page = 1, limit = 10): Promise<PaginatedResponse<Asset>> {
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
    
    const response = await apiClient.get<PaginatedResponse<Asset>>(`/assets?${params.toString()}`);
    return response.data;
  }

  async getById(id: string): Promise<Asset> {
    const response = await apiClient.get<Asset>(`/assets/${id}`);
    return response.data;
  }

  async create(data: CreateAssetData): Promise<Asset> {
    const response = await apiClient.post<Asset>('/assets', data);
    return response.data;
  }

  async update(id: string, data: UpdateAssetData): Promise<Asset> {
    const response = await apiClient.patch<Asset>(`/assets/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/assets/${id}`);
  }

  async getStats(): Promise<AssetStats> {
    const response = await apiClient.get<AssetStats>('/assets/stats');
    return response.data;
  }

  async getByOwner(ownerId: string): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>(`/assets/owner/${ownerId}`);
    return response.data;
  }

  async getByPolicy(policyId: string): Promise<Asset[]> {
    const response = await apiClient.get<Asset[]>(`/assets/policy/${policyId}`);
    return response.data;
  }

  async uploadDocument(id: string, file: File, name: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    
    await apiClient.post(`/assets/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteDocument(id: string, documentId: string): Promise<void> {
    await apiClient.delete(`/assets/${id}/documents/${documentId}`);
  }

  async uploadImage(id: string, file: File, caption?: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) {
      formData.append('caption', caption);
    }
    
    await apiClient.post(`/assets/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteImage(id: string, imageId: string): Promise<void> {
    await apiClient.delete(`/assets/${id}/images/${imageId}`);
  }
}

export const assetService = new AssetService();
