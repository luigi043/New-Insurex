import api from './api';

export const reportService = {
  async getReportData(reportType: string, params?: any) {
    const response = await api.get(`/reports/${reportType}`, { params });
    return response.data;
  },

  async exportReport(reportType: string, params?: any) {
    const response = await api.get(`/reports/${reportType}/export`, {
      params,
      responseType: 'blob'
    });
    return response;
  },

  async getReportList() {
    const response = await api.get('/reports');
    return response.data;
  },

  async scheduleReport(reportType: string, schedule: any) {
    const response = await api.post('/reports/schedule', { reportType, schedule });
    return response.data;
  }
};