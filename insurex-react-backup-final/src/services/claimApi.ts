import axios from 'axios';
import { ClaimStatus, DocumentCategory } from '../types/claim.types';

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

export const claimApi = {
  getAll: (params?: any) => api.get('/claims', { params }),
  getById: (id: string) => api.get(`/claims/${id}`),
  create: (data: any) => api.post('/claims', data),
  processClaim: (id: string, data: { action: ClaimStatus; approvedAmount?: number; rejectionReason?: string; notes?: string }) => 
    api.post(`/claims/${id}/process`, data),
  uploadDocument: (id: string, formData: FormData) => 
    api.post(`/claims/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};