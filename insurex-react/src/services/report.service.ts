import api from './api';

export const reportService = {
  // Export report
  exportReport: (reportType: string, params: any) => {
    return api.get(`/reports/export/${reportType}`, {
      params,
      responseType: 'blob',
    });
  },

  // Get report data (for preview)
  getReportData: (reportType: string, params: any) => {
    return api.get(`/reports/data/${reportType}`, { params });
  },

  // Get available reports
  getAvailableReports: () => {
    return [
      { id: 'policies', name: 'Policies Report' },
      { id: 'claims', name: 'Claims Report' },
      { id: 'assets', name: 'Assets Report' },
      { id: 'premiums', name: 'Premium Collection' },
      { id: 'expiring', name: 'Expiring Policies' },
      { id: 'uninsured', name: 'Uninsured Assets' },
      { id: 'transactions', name: 'Monthly Transactions' },
      { id: 'reinstated', name: 'Reinstated Cover' },
    ];
  },

  // Schedule report
  scheduleReport: (data: any) => {
    return api.post('/reports/schedule', data);
  },

  // Get scheduled reports
  getScheduledReports: () => {
    return api.get('/reports/scheduled');
  },

  // Delete scheduled report
  deleteScheduledReport: (id: string) => {
    return api.delete(`/reports/scheduled/${id}`);
  }
};