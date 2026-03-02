import { useState, useCallback, useEffect } from 'react';
import { policyService, PaginatedResponse } from '../services/policy.service';
import { Policy, CreatePolicyData, UpdatePolicyData, PolicyFilters, PolicyStats } from '../types/policy.types';

interface UsePoliciesOptions {
  page?: number;
  limit?: number;
  filters?: PolicyFilters;
  autoFetch?: boolean;
}

export const usePolicies = (options: UsePoliciesOptions = {}) => {
  const { page = 1, limit = 10, filters, autoFetch = true } = options;
  
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async (
    fetchPage = page, 
    fetchLimit = limit, 
    fetchFilters = filters
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Policy> = await policyService.getAll(
        fetchFilters,
        fetchPage,
        fetchLimit
      );
      setPolicies(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch policies');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchPolicies();
    }
  }, [autoFetch, fetchPolicies]);

  const createPolicy = useCallback(async (data: CreatePolicyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPolicy = await policyService.create(data);
      setPolicies((prev) => [newPolicy, ...prev]);
      return newPolicy;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create policy');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePolicy = useCallback(async (id: string, data: UpdatePolicyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPolicy = await policyService.update(id, data);
      setPolicies((prev) =>
        prev.map((policy) => (policy.id === id ? updatedPolicy : policy))
      );
      return updatedPolicy;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update policy');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePolicy = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await policyService.delete(id);
      setPolicies((prev) => prev.filter((policy) => policy.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete policy');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPolicy = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const policy = await policyService.getById(id);
      return policy;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch policy');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelPolicy = useCallback(async (id: string, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const cancelledPolicy = await policyService.cancel(id, reason);
      setPolicies((prev) =>
        prev.map((policy) => (policy.id === id ? cancelledPolicy : policy))
      );
      return cancelledPolicy;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel policy');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    policies,
    pagination,
    isLoading,
    error,
    fetchPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    getPolicy,
    cancelPolicy,
  };
};

export const usePolicyStats = () => {
  const [stats, setStats] = useState<PolicyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await policyService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch policy stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
