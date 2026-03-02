import api from './api';
import { Asset, AssetType } from '../types/asset.types';

const mockAssets: Asset[] = [
  { id: '1', name: 'Company Car 001', type: 'Vehicle', value: 45000, status: 'Active', policyId: '1', location: 'Main Office', acquisitionDate: '2023-01-15' },
  { id: '2', name: 'Office Building', type: 'Property', value: 850000, status: 'Active', policyId: '1', location: 'Downtown', acquisitionDate: '2022-06-01' },
  { id: '3', name: 'Forklift XT-2000', type: 'Machinery', value: 35000, status: 'Active', policyId: '2', location: 'Warehouse A', acquisitionDate: '2023-03-20' },
  { id: '4', name: 'Inventory Stock', type: 'StockInventory', value: 120000, status: 'Active', policyId: '2', location: 'Warehouse B', acquisitionDate: '2023-11-01' }
];

export const assetService = {
  async getAssets(page = 1, pageSize = 10, type?: string) {
    let filtered = mockAssets;
    if (type) filtered = mockAssets.filter(a => a.type === type);
    return {
      items: filtered,
      totalItems: filtered.length,
      page,
      pageSize
    };
  },

  async getAsset(id: string): Promise<Asset> {
    const asset = mockAssets.find(a => a.id === id);
    if (!asset) throw new Error('Asset not found');
    return asset;
  },

  async createAsset(data: any): Promise<Asset> {
    const newAsset = {
      id: String(mockAssets.length + 1),
      ...data
    };
    mockAssets.push(newAsset);
    return newAsset;
  },

  getAssetTypes(): AssetType[] {
    return Object.values(AssetType);
  }
};
