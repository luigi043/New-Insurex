// src/hooks/usePartners.ts
import { useState, useCallback } from 'react';
import { partnerService } from '../services/partner.service';
import { Partner, PartnerFilter } from '../types/partner.types';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPartners, setTotalPartners] = useState(0);

  const fetchPartners = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await partnerService.getPartners(params);
      setPartners(response.items);
      setTotalPartners(response.totalItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPartner = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await partnerService.createPartner(data);
      await fetchPartners();
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPartners]);

  const updatePartner = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await partnerService.updatePartner(id, data);
      await fetchPartners();
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPartners]);

  const deletePartner = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await partnerService.deletePartner(id);
      await fetchPartners();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPartners]);

  const getPartnerById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      return await partnerService.getPartner(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    partners,
    loading,
    error,
    totalPartners,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    getPartnerById
  };
};
