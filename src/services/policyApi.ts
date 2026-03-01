import api from './api';

export const policyApi = {
  getAll: (params?: any) => api.get('/policy', { params }),
  getById: (id: string) => api.get(`/policy/${id}`),
  create: (data: any) => api.post('/policy', data),
  update: (id: string, data: any) => api.put(`/policy/${id}`, { ...data, id }),
  delete: (id: string) => api.delete(`/policy/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/policy/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getExpiring: (days: number = 30) => api.get('/policy/expiring', { params: { days } })
};