import apiClient from './api.service';
import {
  Invoice,
  CreateInvoiceData,
  CreatePaymentData,
  BillingFilters,
  BillingStats
} from '../types/billing.types';
import { PaginatedResponse } from './policy.service';

class BillingService {
  async getAll(filters?: BillingFilters, page = 1, limit = 10): Promise<PaginatedResponse<Invoice>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<PaginatedResponse<Invoice>>(`/billing?${params.toString()}`);
    return response.data;
  }

  async getInvoices(filters?: BillingFilters, page = 1, limit = 10): Promise<PaginatedResponse<Invoice>> {
    return this.getAll(filters, page, limit);
  }

  async getById(id: string): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(`/billing/${id}`);
    return response.data;
  }

  async create(data: CreateInvoiceData): Promise<Invoice> {
    const response = await apiClient.post<Invoice>('/billing', data);
    return response.data;
  }

  async createInvoice(data: CreateInvoiceData): Promise<Invoice> {
    return this.create(data);
  }

  async update(id: string, data: Partial<CreateInvoiceData>): Promise<Invoice> {
    const response = await apiClient.patch<Invoice>(`/billing/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/billing/${id}`);
  }

  async getStats(): Promise<BillingStats> {
    const response = await apiClient.get<BillingStats>('/billing/stats');
    return response.data;
  }

  async sendInvoice(id: string): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`/billing/${id}/send`);
    return response.data;
  }

  async recordPayment(id: string, data: CreatePaymentData): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`/billing/${id}/payment`, data);
    return response.data;
  }

  async cancelInvoice(id: string, reason?: string): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`/billing/${id}/cancel`, { reason });
    return response.data;
  }

  async refundInvoice(id: string, amount: number, reason?: string): Promise<Invoice> {
    const response = await apiClient.post<Invoice>(`/billing/${id}/refund`, { amount, reason });
    return response.data;
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>('/billing/overdue');
    return response.data;
  }

  async getByPolicy(policyId: string): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>(`/billing/policy/${policyId}`);
    return response.data;
  }

  async generatePdf(id: string): Promise<Blob> {
    const response = await apiClient.get(`/billing/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async exportInvoices(filters?: BillingFilters): Promise<void> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/billing/export?${params.toString()}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invoices.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export const billingService = new BillingService();
