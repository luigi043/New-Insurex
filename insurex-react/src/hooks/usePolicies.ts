import { useState, useEffect, useCallback } from 'react';
import { policyService } from '../services/policy.service';
import { Policy, PolicyFilter, PaginatedResponse } from '../types/policy.types';

interface UsePoliciesReturn {
  policies: Policy[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: PolicyFilter) => void;
  refresh: () => Promise<void>;
  getPolicy: (id: string) => Promise<Policy | null>;
  createPolicy: (data: any) => Promise<Policy | null>;
  updatePolicy: (id: string, data: any) => Promise<Policy | null>;
  deletePolicy: (id: string) => Promise<boolean>;
}

export const usePolicies = (initialFilters?: PolicyFilter): UsePoliciesReturn => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PolicyFilter>(initialFilters || {});

  const loadPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await policyService.getPolicies(page, pageSize, filters);
      setPolicies(response.items);
      setTotalItems(response.totalItems);
    } catch (err: any) {
      setError(err.message || 'Failed to load policies');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  const getPolicy = useCallback(async (id: string) => {
    try {
      return await policyService.getPolicy(id);
    } catch (err) {
      setError('Failed to load policy');
      return null;
    }
  }, []);

  const createPolicy = useCallback(async (data: any) => {
    try {
      const newPolicy = await policyService.createPolicy(data);
      await loadPolicies();
      return newPolicy;
    } catch (err: any) {
      setError(err.message || 'Failed to create policy');
      return null;
    }
  }, [loadPolicies]);

  const updatePolicy = useCallback(async (id: string, data: any) => {
    try {
      const updated = await policyService.updatePolicy(id, data);
      await loadPolicies();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update policy');
      return null;
    }
  }, [loadPolicies]);

  const deletePolicy = useCallback(async (id: string) => {
    try {
      await policyService.deletePolicy(id);
      await loadPolicies();
      return true;
    } catch (err) {
      setError('Failed to delete policy');
      return false;
    }
  }, [loadPolicies]);

  return {
    policies,
    loading,
    error,
    totalItems,
    page,
    pageSize,
    setPage,
    setPageSize,
    setFilters,
    refresh: loadPolicies,
    getPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy,
  };
};
