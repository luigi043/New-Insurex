import { useState, useEffect, useCallback } from 'react';
import { claimService } from '../services/claim.service';
import { Claim, ClaimFilter, ClaimStats, PaginatedResponse } from '../types/claim.types';

interface UseClaimsOptions {
  page?: number;
  pageSize?: number;
  filters?: ClaimFilter;
  autoFetch?: boolean;
}

interface UseClaimsReturn {
  claims: Claim[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchClaim: (id: string) => Promise<Claim | null>;
  createClaim: (data: any) => Promise<Claim | null>;
  updateClaim: (id: string, data: any) => Promise<Claim | null>;
  deleteClaim: (id: string) => Promise<boolean>;
  submitClaim: (id: string) => Promise<Claim | null>;
  getStats: () => Promise<ClaimStats | null>;
  getPendingCount: () => Promise<number>;
  workflowAction: (id: string, action: any) => Promise<Claim | null>;
}

export const useClaims = (options: UseClaimsOptions = {}): UseClaimsReturn => {
  const {
    page = 1,
    pageSize = 10,
    filters,
    autoFetch = true,
  } = options;

  const [claims, setClaims] = useState<Claim[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Claim> = await claimService.getClaims(
        currentPage,
        pageSize,
        filters
      );
      setClaims(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch claims');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchClaims();
    }
  }, [fetchClaims, autoFetch]);

  const fetchClaim = useCallback(async (id: string): Promise<Claim | null> => {
    try {
      return await claimService.getClaim(id);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch claim');
      return null;
    }
  }, []);

  const createClaim = useCallback(async (data: any): Promise<Claim | null> => {
    try {
      const newClaim = await claimService.createClaim(data);
      await fetchClaims();
      return newClaim;
    } catch (err: any) {
      setError(err.message || 'Failed to create claim');
      return null;
    }
  }, [fetchClaims]);

  const updateClaim = useCallback(async (id: string, data: any): Promise<Claim | null> => {
    try {
      const updatedClaim = await claimService.updateClaim(id, data);
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? updatedClaim : c))
      );
      return updatedClaim;
    } catch (err: any) {
      setError(err.message || 'Failed to update claim');
      return null;
    }
  }, []);

  const deleteClaim = useCallback(async (id: string): Promise<boolean> => {
    try {
      await claimService.deleteClaim(id);
      setClaims((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete claim');
      return false;
    }
  }, []);

  const submitClaim = useCallback(async (id: string): Promise<Claim | null> => {
    try {
      const submittedClaim = await claimService.submitClaim(id);
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? submittedClaim : c))
      );
      return submittedClaim;
    } catch (err: any) {
      setError(err.message || 'Failed to submit claim');
      return null;
    }
  }, []);

  const getStats = useCallback(async (): Promise<ClaimStats | null> => {
    try {
      return await claimService.getClaimStats();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch claim stats');
      return null;
    }
  }, []);

  const getPendingCount = useCallback(async (): Promise<number> => {
    try {
      return await claimService.getPendingCount();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending count');
      return 0;
    }
  }, []);

  const workflowAction = useCallback(async (id: string, action: any): Promise<Claim | null> => {
    try {
      const updatedClaim = await claimService.workflowAction(id, action);
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? updatedClaim : c))
      );
      return updatedClaim;
    } catch (err: any) {
      setError(err.message || 'Failed to perform workflow action');
      return null;
    }
  }, []);

  return {
    claims,
    totalItems,
    totalPages,
    currentPage,
    isLoading,
    error,
    refetch: fetchClaims,
    fetchClaim,
    createClaim,
    updateClaim,
    deleteClaim,
    submitClaim,
    getStats,
    getPendingCount,
    workflowAction,
  };
};
