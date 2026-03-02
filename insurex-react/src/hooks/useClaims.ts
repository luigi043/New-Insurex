import { useState, useCallback, useEffect } from 'react';
import { claimService } from '../services/claim.service';
import { Claim, CreateClaimData, UpdateClaimData, ClaimFilters, ClaimStats, ClaimHistory } from '../types/claim.types';
import { PaginatedResponse } from '../services/policy.service';

interface UseClaimsOptions {
  page?: number;
  limit?: number;
  filters?: ClaimFilters;
  autoFetch?: boolean;
}

export const useClaims = (options: UseClaimsOptions = {}) => {
  const { page = 1, limit = 10, filters, autoFetch = true } = options;
  
  const [claims, setClaims] = useState<Claim[]>([]);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async (
    fetchPage = page, 
    fetchLimit = limit, 
    fetchFilters = filters
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Claim> = await claimService.getAll(
        fetchFilters,
        fetchPage,
        fetchLimit
      );
      setClaims(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch claims');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchClaims();
    }
  }, [autoFetch, fetchClaims]);

  const createClaim = useCallback(async (data: CreateClaimData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newClaim = await claimService.create(data);
      setClaims((prev) => [newClaim, ...prev]);
      return newClaim;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateClaim = useCallback(async (id: string, data: UpdateClaimData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedClaim = await claimService.update(id, data);
      setClaims((prev) =>
        prev.map((claim) => (claim.id === id ? updatedClaim : claim))
      );
      return updatedClaim;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteClaim = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await claimService.delete(id);
      setClaims((prev) => prev.filter((claim) => claim.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getClaim = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const claim = await claimService.getById(id);
      return claim;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitClaim = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const submittedClaim = await claimService.submit(id);
      setClaims((prev) =>
        prev.map((claim) => (claim.id === id ? submittedClaim : claim))
      );
      return submittedClaim;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveClaim = useCallback(async (id: string, approvedAmount: number, notes?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const approvedClaim = await claimService.approve(id, approvedAmount, notes);
      setClaims((prev) =>
        prev.map((claim) => (claim.id === id ? approvedClaim : claim))
      );
      return approvedClaim;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectClaim = useCallback(async (id: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const rejectedClaim = await claimService.reject(id, reason);
      setClaims((prev) =>
        prev.map((claim) => (claim.id === id ? rejectedClaim : claim))
      );
      return rejectedClaim;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const settleClaim = useCallback(async (id: string, settlementAmount: number, notes?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const settledClaim = await claimService.settle(id, settlementAmount, notes);
      setClaims((prev) =>
        prev.map((claim) => (claim.id === id ? settledClaim : claim))
      );
      return settledClaim;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to settle claim');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    claims,
    pagination,
    isLoading,
    error,
    fetchClaims,
    createClaim,
    updateClaim,
    deleteClaim,
    getClaim,
    submitClaim,
    approveClaim,
    rejectClaim,
    settleClaim,
  };
};

export const useClaimStats = () => {
  const [stats, setStats] = useState<ClaimStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await claimService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch claim stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};

export const useClaimHistory = (claimId: string) => {
  const [history, setHistory] = useState<ClaimHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!claimId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await claimService.getHistory(claimId);
      setHistory(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch claim history');
    } finally {
      setIsLoading(false);
    }
  }, [claimId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, error, refetch: fetchHistory };
};
