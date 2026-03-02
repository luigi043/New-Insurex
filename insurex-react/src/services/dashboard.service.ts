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
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },

  async getPolicyChart(period: string = 'month'): Promise<ChartData> {
    const response = await api.get<ChartData>(`/dashboard/charts/policies?period=${period}`);
    return response.data;
  },

  async getClaimChart(period: string = 'month'): Promise<ChartData> {
    const response = await api.get<ChartData>(`/dashboard/charts/claims?period=${period}`);
    return response.data;
  },

  async getRevenueChart(period: string = 'month'): Promise<ChartData> {
    const response = await api.get<ChartData>(`/dashboard/charts/revenue?period=${period}`);
    return response.data;
  },

  async getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
    const response = await api.get<ActivityItem[]>(`/dashboard/activity?limit=${limit}`);
    return response.data;
  },
};
