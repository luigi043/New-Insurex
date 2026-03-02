import { useState, useEffect, useCallback } from 'react';
import { assetService } from '../services/asset.service';
import { Asset, AssetFilter, AssetStats, PaginatedResponse } from '../types/asset.types';

interface UseAssetsOptions {
  page?: number;
  pageSize?: number;
  filters?: AssetFilter;
  autoFetch?: boolean;
}

interface UseAssetsReturn {
  assets: Asset[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchAsset: (id: string) => Promise<Asset | null>;
  createAsset: (data: any) => Promise<Asset | null>;
  updateAsset: (id: string, data: any) => Promise<Asset | null>;
  deleteAsset: (id: string) => Promise<boolean>;
  getStats: () => Promise<AssetStats | null>;
  searchAssets: (query: string) => Promise<Asset[]>;
  bulkDelete: (ids: string[]) => Promise<boolean>;
}

export const useAssets = (options: UseAssetsOptions = {}): UseAssetsReturn => {
  const {
    page = 1,
    pageSize = 10,
    filters,
    autoFetch = true,
  } = options;

  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Asset> = await assetService.getAssets(
        currentPage,
        pageSize,
        filters
      );
      setAssets(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchAssets();
    }
  }, [fetchAssets, autoFetch]);

  const fetchAsset = useCallback(async (id: string): Promise<Asset | null> => {
    try {
      return await assetService.getAsset(id);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch asset');
      return null;
    }
  }, []);

  const createAsset = useCallback(async (data: any): Promise<Asset | null> => {
    try {
      const newAsset = await assetService.createAsset(data);
      await fetchAssets();
      return newAsset;
    } catch (err: any) {
      setError(err.message || 'Failed to create asset');
      return null;
    }
  }, [fetchAssets]);

  const updateAsset = useCallback(async (id: string, data: any): Promise<Asset | null> => {
    try {
      const updatedAsset = await assetService.updateAsset(id, data);
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? updatedAsset : a))
      );
      return updatedAsset;
    } catch (err: any) {
      setError(err.message || 'Failed to update asset');
      return null;
    }
  }, []);

  const deleteAsset = useCallback(async (id: string): Promise<boolean> => {
    try {
      await assetService.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete asset');
      return false;
    }
  }, []);

  const getStats = useCallback(async (): Promise<AssetStats | null> => {
    try {
      return await assetService.getAssetStats();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch asset stats');
      return null;
    }
  }, []);

  const searchAssets = useCallback(async (query: string): Promise<Asset[]> => {
    try {
      return await assetService.searchAssets(query);
    } catch (err: any) {
      setError(err.message || 'Failed to search assets');
      return [];
    }
  }, []);

  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      await assetService.bulkDelete(ids);
      setAssets((prev) => prev.filter((a) => !ids.includes(a.id)));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete assets');
      return false;
    }
  }, []);

  return {
    assets,
    totalItems,
    totalPages,
    currentPage,
    isLoading,
    error,
    refetch: fetchAssets,
    fetchAsset,
    createAsset,
    updateAsset,
    deleteAsset,
    getStats,
    searchAssets,
    bulkDelete,
  };
};
