import { useState, useCallback, useEffect } from 'react';
import { assetService } from '../services/asset.service';
import { Asset, CreateAssetData, UpdateAssetData, AssetFilters, AssetStats } from '../types/asset.types';
import { PaginatedResponse } from '../services/policy.service';

interface UseAssetsOptions {
  page?: number;
  limit?: number;
  filters?: AssetFilters;
  autoFetch?: boolean;
}

export const useAssets = (options: UseAssetsOptions = {}) => {
  const { page = 1, limit = 10, filters, autoFetch = true } = options;
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async (
    fetchPage = page, 
    fetchLimit = limit, 
    fetchFilters = filters
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Asset> = await assetService.getAll(
        fetchFilters,
        fetchPage,
        fetchLimit
      );
      setAssets(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchAssets();
    }
  }, [autoFetch, fetchAssets]);

  const createAsset = useCallback(async (data: CreateAssetData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAsset = await assetService.create(data);
      setAssets((prev) => [newAsset, ...prev]);
      return newAsset;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create asset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAsset = useCallback(async (id: string, data: UpdateAssetData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedAsset = await assetService.update(id, data);
      setAssets((prev) =>
        prev.map((asset) => (asset.id === id ? updatedAsset : asset))
      );
      return updatedAsset;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update asset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await assetService.delete(id);
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete asset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAsset = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const asset = await assetService.getById(id);
      return asset;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch asset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    assets,
    pagination,
    isLoading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    getAsset,
  };
};

export const useAssetStats = () => {
  const [stats, setStats] = useState<AssetStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await assetService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch asset stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
