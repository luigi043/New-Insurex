import api from './api';
import { Asset, PaginatedResponse } from '../types/asset.types';

export const assetService = {
  getAssets: (page: number = 1, pageSize: number = 10, type?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(type && { type }),
    });
    return api.get<PaginatedResponse<Asset>>(`/assets?${params}`);
  },

  getAsset: (id: string) => {
    return api.get<Asset>(`/assets/${id}`);
  },

  createAsset: (data: Partial<Asset>) => {
    return api.post<Asset>('/assets', data);
  },

  updateAsset: (id: string, data: Partial<Asset>) => {
    return api.put<Asset>(`/assets/${id}`, data);
  },

  deleteAsset: (id: string) => {
    return api.delete(`/assets/${id}`);
  },

  getAssetsByPolicy: (policyId: string) => {
    return api.get<Asset[]>(`/assets/policy/${policyId}`);
  },

  getAssetTypes: () => {
    return [
      'Vehicle', 'Property', 'Watercraft', 'Aviation',
      'StockInventory', 'AccountsReceivable', 'Machinery',
      'PlantEquipment', 'BusinessInterruption', 'KeymanInsurance',
      'ElectronicEquipment'
    ];
  }
};