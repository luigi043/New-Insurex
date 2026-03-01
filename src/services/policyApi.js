import api from './api';

export const policyApi = {
  getAll: (params) => api.get('/policy', { params }),
  getById: (id) => api.get(/policy/),
  create: (data) => api.post('/policy', data),
  update: (id, data) => api.put(/policy/, { ...data, id }),
  delete: (id) => api.delete(/policy/),
  updateStatus: (id, status) => api.patch(/policy//status, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getExpiring: (days = 30) => api.get('/policy/expiring', { params: { days } })
};
