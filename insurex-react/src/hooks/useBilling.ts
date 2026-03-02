import { useState, useCallback, useEffect } from 'react';
import { billingService } from '../services/billing.service';
import { Invoice, CreateInvoiceData, CreatePaymentData, BillingFilters, BillingStats } from '../types/billing.types';
import { PaginatedResponse } from '../services/policy.service';

interface UseBillingOptions {
  page?: number;
  limit?: number;
  filters?: BillingFilters;
  autoFetch?: boolean;
}

export const useBilling = (options: UseBillingOptions = {}) => {
  const { page = 1, limit = 10, filters, autoFetch = true } = options;
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState({
    page,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async (
    fetchPage = page, 
    fetchLimit = limit, 
    fetchFilters = filters
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Invoice> = await billingService.getAll(
        fetchFilters,
        fetchPage,
        fetchLimit
      );
      setInvoices(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoices');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchInvoices();
    }
  }, [autoFetch, fetchInvoices]);

  const createInvoice = useCallback(async (data: CreateInvoiceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newInvoice = await billingService.create(data);
      setInvoices((prev) => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateInvoice = useCallback(async (id: string, data: Partial<CreateInvoiceData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedInvoice = await billingService.update(id, data);
      setInvoices((prev) =>
        prev.map((invoice) => (invoice.id === id ? updatedInvoice : invoice))
      );
      return updatedInvoice;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteInvoice = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await billingService.delete(id);
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getInvoice = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const invoice = await billingService.getById(id);
      return invoice;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendInvoice = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const sentInvoice = await billingService.sendInvoice(id);
      setInvoices((prev) =>
        prev.map((invoice) => (invoice.id === id ? sentInvoice : invoice))
      );
      return sentInvoice;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordPayment = useCallback(async (id: string, data: CreatePaymentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const paidInvoice = await billingService.recordPayment(id, data);
      setInvoices((prev) =>
        prev.map((invoice) => (invoice.id === id ? paidInvoice : invoice))
      );
      return paidInvoice;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelInvoice = useCallback(async (id: string, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const cancelledInvoice = await billingService.cancelInvoice(id, reason);
      setInvoices((prev) =>
        prev.map((invoice) => (invoice.id === id ? cancelledInvoice : invoice))
      );
      return cancelledInvoice;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOverdueInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const overdue = await billingService.getOverdueInvoices();
      return overdue;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch overdue invoices');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    invoices,
    pagination,
    isLoading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    sendInvoice,
    recordPayment,
    cancelInvoice,
    getOverdueInvoices,
  };
};

export const useBillingStats = () => {
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await billingService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch billing stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
