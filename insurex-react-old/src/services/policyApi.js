import api from './api';

export const policyApi = {
  // Get all policies with search/filter
  getAll: (searchParams) => api.get('/policy', { params: searchParams }),
  
  // Get single policy by ID
  getById: (id) => api.get(/policy/),
  
  // Create new policy
  create: (data) => api.post('/policy', data),
  
  // Update policy
  update: (id, data) => api.put(/policy/, { ...data, id }),
  
  // Delete policy
  delete: (id) => api.delete(/policy/),
  
  // Update policy status
  updateStatus: (id, status) => api.patch(/policy//status, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  
  // Get expiring policies
  getExpiring: (days = 30) => api.get('/policy/expiring', { params: { days } })
};
