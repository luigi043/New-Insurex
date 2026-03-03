import apiClient from '../../../services/api.service';
import { Asset, CreateAssetData, UpdateAssetData, AssetFilterRequest } from '../types/asset.types';
import { PagedResult } from '../../../types/common.types';
class AssetService {
  async getAll(params: { page: number; pageSize: number }): Promise<PagedResult<Asset>> {
    const response = await apiClient.get('/assets', { params });
    return response.data?.data || response.data;
  }
  async filter(params: AssetFilterRequest): Promise<PagedResult<Asset>> {
    const response = await apiClient.get('/assets/filter', { params });
    return response.data?.data || response.data;
  }
  async getById(id: number): Promise<Asset> {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data?.data || response.data;
  }
  async create(data: CreateAssetData): Promise<Asset> {
    const response = await apiClient.post('/assets', data);
    return response.data?.data || response.data;
  }
  async update(id: number, data: UpdateAssetData): Promise<Asset> {
    const response = await apiClient.put(`/assets/${id}`, data);
    return response.data?.data || response.data;
  }
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/assets/${id}`);
  }
}
export const assetService = new AssetService();