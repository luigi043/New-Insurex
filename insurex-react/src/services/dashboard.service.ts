import api from './api';

export interface DashboardSummary {
  totalPolicies: number;
  activePolicies: number;
  totalClaims: number;
  pendingClaims: number;
  totalAssets: number;
  totalAssetValue: number;
  totalInvoices: number;
  overdueInvoices: number;
  monthlyPremium: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'policy' | 'claim' | 'asset' | 'invoice';
  action: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  async getChartData() {
    const response = await api.get('/dashboard/charts');
    return response.data;
  },

  async getRecentActivity(limit = 10) {
    const response = await api.get('/dashboard/activity', { params: { limit } });
    return response.data;
  },

  async getKPI() {
    const response = await api.get('/dashboard/kpi');
    return response.data;
  }
};