import api from './api';
import { Partner, PartnerFilter, PaginatedResponse } from '../types';
export const partnerService = {
  getPartners: (params) => api.get('/partners', { params }),
  getPartner: (id) => api.get(`/partners/${id}`),
  createPartner: (data) => api.post('/partners', data),
  updatePartner: (id, data) => api.put(`/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/partners/${id}`),
};
export const partnerService = {
  async getPartners(page = 1, pageSize = 10, filters?: PartnerFilter) {
    const response = await api.get('/partners', { params: { page, pageSize, ...filters } });
    return response.data;
  },

  async getPartner(id: string) {
    const response = await api.get(`/partners/${id}`);
    return response.data;
  },

  async createPartner(data: Partial<Partner>) {
    const response = await api.post('/partners', data);
    return response.data;
  },

  async updatePartner(id: string, data: Partial<Partner>) {
    const response = await api.put(`/partners/${id}`, data);
    return response.data;
  },

  async deletePartner(id: string) {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  },

  async approvePartner(id: string) {
    const response = await api.post(`/partners/${id}/approve`);
    return response.data;
  },

  async rejectPartner(id: string, reason: string) {
    const response = await api.post(`/partners/${id}/reject`, { reason });
    return response.data;
  }
}; 