import { useState, useEffect, useCallback } from 'react';
import { assetService } from '../services/asset.service';
import { Asset, AssetType } from '../types/asset.types';

interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTypeFilter: (type?: AssetType) => void;
  refresh: () => Promise<void>;
  getAsset: (id: string) => Promise<Asset | null>;
  createAsset: (data: any) => Promise<Asset | null>;
  updateAsset: (id: string, data: any) => Promise<Asset | null>;
  deleteAsset: (id: string) => Promise<boolean>;
}

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<AssetType | undefined>();

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assetService.getAssets(page, pageSize, typeFilter);
      setAssets(response.items);
      setTotalItems(response.totalItems);
    } catch (err: any) {
      setError(err.message || 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, typeFilter]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const getAsset = useCallback(async (id: string) => {
    try {
      return await assetService.getAsset(id);
    } catch (err) {
      setError('Failed to load asset');
      return null;
    }
  }, []);

  const createAsset = useCallback(async (data: any) => {
    try {
      const newAsset = await assetService.createAsset(data);
      await loadAssets();
      return newAsset;
    } catch (err: any) {
      setError(err.message || 'Failed to create asset');
      return null;
    }
  }, [loadAssets]);

  const updateAsset = useCallback(async (id: string, data: any) => {
    try {
      const updated = await assetService.updateAsset(id, data);
      await loadAssets();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update asset');
      return null;
    }
  }, [loadAssets]);

  const deleteAsset = useCallback(async (id: string) => {
    try {
      await assetService.deleteAsset(id);
      await loadAssets();
      return true;
    } catch (err) {
      setError('Failed to delete asset');
      return false;
    }
  }, [loadAssets]);

  return {
    assets,
    loading,
    error,
    totalItems,
    page,
    pageSize,
    setPage,
    setPageSize,
    setTypeFilter,
    refresh: loadAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset,
  };
};
