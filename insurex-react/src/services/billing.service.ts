import api from './api';
import { Invoice, Payment, Transaction } from '../types/billing.types';

export const billingService = {
  // ===== INVOICES =====
  getInvoices: (page: number = 1, pageSize: number = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(status && { status }),
    });
    return api.get(\/invoices?\\);
  },

  getInvoice: (id: string) => {
    return api.get<Invoice>(\/invoices/\\);
  },

  createInvoice: (data: Partial<Invoice>) => {
    return api.post<Invoice>('/invoices', data);
  },

  updateInvoice: (id: string, data: Partial<Invoice>) => {
    return api.put<Invoice>(\/invoices/\\, data);
  },

  deleteInvoice: (id: string) => {
    return api.delete(\/invoices/\\);
  },

  sendInvoice: (id: string) => {
    return api.post(\/invoices/\/send\);
  },

  markAsPaid: (id: string, paymentData: Partial<Payment>) => {
    return api.post(\/invoices/\/pay\, paymentData);
  },

  // ===== PAYMENTS =====
  getPayments: (page: number = 1, pageSize: number = 10) => {
    return api.get(\/payments?page=\&pageSize=\\);
  },

  processPayment: (data: Partial<Payment>) => {
    return api.post<Payment>('/payments', data);
  },

  // ===== EXPORTS =====
  exportInvoices: (filters?: any) => {
    return api.get('/billing/export/invoices', {
      params: filters,
      responseType: 'blob',
    });
  },

  exportTransactions: (filters?: any) => {
    return api.get('/billing/export/transactions', {
      params: filters,
      responseType: 'blob',
    });
  }
};
