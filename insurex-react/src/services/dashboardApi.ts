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

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats').then(r => r.data),
  getSummary: () => api.get('/dashboard/summary'),
  getPolicyChartData: () => api.get('/dashboard/policy-chart'),
  getRecentActivity: (count: number = 10) => api.get('/dashboard/activity', { params: { count } }),
  getPremiumTrend: (months: number = 12) => api.get('/dashboard/premium-trend', { params: { months } }),
  getExpiringChart: () => api.get('/dashboard/expiring-chart'),
};