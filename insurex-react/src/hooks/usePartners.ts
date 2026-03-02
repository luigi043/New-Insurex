import { useState, useCallback, useEffect } from 'react';
import { partnerService } from '../services/partner.service';
import { Partner, CreatePartnerData, UpdatePartnerData, PartnerFilters, PartnerStats } from '../types/partner.types';
import { PaginatedResponse } from '../services/policy.service';

interface UsePartnersOptions {
  page?: number;
  limit?: number;
  filters?: PartnerFilters;
  autoFetch?: boolean;
}

export const usePartners = (options: UsePartnersOptions = {}) => {
  const { page = 1, limit = 10, filters, autoFetch = true } = options;
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = useCallback(async (
    fetchPage = page, 
    fetchLimit = limit, 
    fetchFilters = filters
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Partner> = await partnerService.getAll(
        fetchFilters,
        fetchPage,
        fetchLimit
      );
      setPartners(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch partners');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchPartners();
    }
  }, [autoFetch, fetchPartners]);

  const createPartner = useCallback(async (data: CreatePartnerData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPartner = await partnerService.create(data);
      setPartners((prev) => [newPartner, ...prev]);
      return newPartner;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create partner');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePartner = useCallback(async (id: string, data: UpdatePartnerData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPartner = await partnerService.update(id, data);
      setPartners((prev) =>
        prev.map((partner) => (partner.id === id ? updatedPartner : partner))
      );
      return updatedPartner;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update partner');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePartner = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await partnerService.delete(id);
      setPartners((prev) => prev.filter((partner) => partner.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete partner');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPartner = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const partner = await partnerService.getById(id);
      return partner;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch partner');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activatePartner = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const activatedPartner = await partnerService.activate(id);
      setPartners((prev) =>
        prev.map((partner) => (partner.id === id ? activatedPartner : partner))
      );
      return activatedPartner;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to activate partner');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deactivatePartner = useCallback(async (id: string, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const deactivatedPartner = await partnerService.deactivate(id, reason);
      setPartners((prev) =>
        prev.map((partner) => (partner.id === id ? deactivatedPartner : partner))
      );
      return deactivatedPartner;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to deactivate partner');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    partners,
    pagination,
    isLoading,
    error,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    getPartner,
    activatePartner,
    deactivatePartner,
  };
};

export const usePartnerStats = () => {
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partnerService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch partner stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
