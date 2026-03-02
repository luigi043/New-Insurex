import api from './api';
import { Asset, PaginatedResponse } from '../types/asset.types';

export const assetService = {
  async getAssets(
    page: number = 1,
    pageSize: number = 10,
    type?: string
  ): Promise<PaginatedResponse<Asset>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(type && { type }),
    });
    const response = await api.get<PaginatedResponse<Asset>>(`/assets?${params}`);
    return response.data;
  },

  async getAsset(id: string): Promise<Asset> {
    const response = await api.get<Asset>(`/assets/${id}`);
    return response.data;
  },

  async createAsset(data: any): Promise<Asset> {
    const response = await api.post<Asset>('/assets', data);
    return response.data;
  },

  async updateAsset(id: string, data: any): Promise<Asset> {
    const response = await api.put<Asset>(`/assets/${id}`, data);
    return response.data;
  },

  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  getAssetTypes(): string[] {
    return [
      'Vehicle', 'Property', 'Watercraft', 'Aviation',
      'StockInventory', 'AccountsReceivable', 'Machinery',
      'PlantEquipment', 'BusinessInterruption', 'KeymanInsurance',
      'ElectronicEquipment'
    ];
  },
};
