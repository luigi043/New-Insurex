import api from './api';

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getPolicyChartData: () => api.get('/dashboard/charts/policy-status'),
  getRecentActivity: (count = 10) => api.get('/dashboard/recent-activity', { params: { count } }),
  getPremiumTrend: (months = 6) => api.get('/dashboard/premium-trend', { params: { months } }),
  getExpiringChart: () => api.get('/dashboard/expiring-chart')
};