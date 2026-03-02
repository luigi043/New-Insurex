import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const policyApi = {
  getAll: (params?: any) => api.get('/policy', { params }),
  getById: (id: string) => api.get(`/policy/${id}`),  // Fixed: was using regex /policy/
  create: (data: any) => api.post('/policy', data),
  update: (id: string, data: any) => api.put(`/policy/${id}`, data),  // Fixed
  delete: (id: string) => api.delete(`/policy/${id}`),  // Fixed
  updateStatus: (id: string, status: string) => api.patch(`/policy/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getExpiring: (days: number = 30) => api.get('/policy/expiring', { params: { days } })
};