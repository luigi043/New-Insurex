import { useState, useEffect, useCallback } from 'react';
import { claimService } from '../services/claim.service';
import { Claim, ClaimStatus, ProcessClaimRequest } from '../types/claim.types';

interface UseClaimsReturn {
  claims: Claim[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setStatusFilter: (status?: ClaimStatus) => void;
  refresh: () => Promise<void>;
  getClaim: (id: string) => Promise<Claim | null>;
  createClaim: (data: any) => Promise<Claim | null>;
  processClaim: (id: string, data: ProcessClaimRequest) => Promise<Claim | null>;
  uploadDocument: (claimId: string, file: File) => Promise<void>;
}

export const useClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | undefined>();

  const loadClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await claimService.getClaims(page, pageSize, statusFilter);
      setClaims(response.items);
      setTotalItems(response.totalItems);
    } catch (err: any) {
      setError(err.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const getClaim = useCallback(async (id: string) => {
    try {
      return await claimService.getClaim(id);
    } catch (err) {
      setError('Failed to load claim');
      return null;
    }
  }, []);

  const createClaim = useCallback(async (data: any) => {
    try {
      const newClaim = await claimService.createClaim(data);
      await loadClaims();
      return newClaim;
    } catch (err: any) {
      setError(err.message || 'Failed to create claim');
      return null;
    }
  }, [loadClaims]);

  const processClaim = useCallback(async (id: string, data: ProcessClaimRequest) => {
    try {
      const updated = await claimService.processClaim(id, data);
      await loadClaims();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to process claim');
      return null;
    }
  }, [loadClaims]);

  const uploadDocument = useCallback(async (claimId: string, file: File) => {
    try {
      await claimService.uploadDocument(claimId, file);
      await loadClaims();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    }
  }, [loadClaims]);

  return {
    claims,
    loading,
    error,
    totalItems,
    page,
    pageSize,
    setPage,
    setPageSize,
    setStatusFilter,
    refresh: loadClaims,
    getClaim,
    createClaim,
    processClaim,
    uploadDocument,
  };
};
