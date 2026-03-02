import api from './api';

export const billingService = {
  getInvoices: (page: number = 1, pageSize: number = 10, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (status) params.append('status', status);
    
    return api.get(`/invoices?${params.toString()}`);
  },

  getInvoice: (id: string) => {
    return api.get(`/invoices/${id}`);
  },

  createInvoice: (data: any) => {
    return api.post('/invoices', data);
  },

  exportInvoices: (filters?: any) => {
    return api.get('/billing/export/invoices', {
      params: filters,
      responseType: 'blob',
    });
  }
};
