import { useState, useEffect, useCallback } from 'react';
import { policyService } from '../services/policy.service';
import { Policy, PolicyFilter, PaginatedResponse, PolicyStats } from '../types/policy.types';

interface UsePoliciesOptions {
  page?: number;
  pageSize?: number;
  filters?: PolicyFilter;
  autoFetch?: boolean;
}

interface UsePoliciesReturn {
  policies: Policy[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchPolicy: (id: string) => Promise<Policy | null>;
  createPolicy: (data: any) => Promise<Policy | null>;
  updatePolicy: (id: string, data: any) => Promise<Policy | null>;
  deletePolicy: (id: string) => Promise<boolean>;
  getStats: () => Promise<PolicyStats | null>;
}

export const usePolicies = (options: UsePoliciesOptions = {}): UsePoliciesReturn => {
  const {
    page = 1,
    pageSize = 10,
    filters,
    autoFetch = true,
  } = options;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Policy> = await policyService.getPolicies(
        currentPage,
        pageSize,
        filters
      );
      setPolicies(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch policies');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchPolicies();
    }
  }, [fetchPolicies, autoFetch]);

  const fetchPolicy = useCallback(async (id: string): Promise<Policy | null> => {
    try {
      return await policyService.getPolicy(id);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch policy');
      return null;
    }
  }, []);

  const createPolicy = useCallback(async (data: any): Promise<Policy | null> => {
    try {
      const newPolicy = await policyService.createPolicy(data);
      await fetchPolicies();
      return newPolicy;
    } catch (err: any) {
      setError(err.message || 'Failed to create policy');
      return null;
    }
  }, [fetchPolicies]);

  const updatePolicy = useCallback(async (id: string, data: any): Promise<Policy | null> => {
    try {
      const updatedPolicy = await policyService.updatePolicy(id, data);
      setPolicies((prev) =>
        prev.map((p) => (p.id === id ? updatedPolicy : p))
      );
      return updatedPolicy;
    } catch (err: any) {
      setError(err.message || 'Failed to update policy');
      return null;
    }
  }, []);

  const deletePolicy = useCallback(async (id: string): Promise<boolean> => {
    try {
      await policyService.deletePolicy(id);
      setPolicies((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete policy');
      return false;
    }
  }, []);

  const getStats = useCallback(async (): Promise<PolicyStats | null> => {
    try {
      return await policyService.getPolicyStats();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch policy stats');
      return null;
    }
  }, []);

  return {
    policies,
    totalItems,
    totalPages,
    currentPage,
    isLoading,
    error,
    refetch: fetchPolicies,
    fetchPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy,
    getStats,
  };
};
