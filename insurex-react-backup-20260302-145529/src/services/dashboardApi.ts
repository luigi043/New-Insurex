import api from './api';

export interface SummaryData {
  totalPolicies: number;
  activePolicies: number;
  expiringSoon: number;
  totalAssets: number;
  totalInsuredValue: number;
  pendingClaims: number;
}

export interface ChartItem {
  label: string;
  value: number;
  amount?: number;
}

export interface ChartData {
  byStatus: ChartItem[];
  byType: ChartItem[];
  byMonth: ChartItem[];
}

export interface ActivityItem {
  activityType: string;
  description: string;
  reference: string;
  timestamp: string;
  user: string;
}

export const dashboardApi = {
  getSummary: () => {
    return api.get<SummaryData>('/dashboard/summary');
  },

  getPolicyChartData: () => {
    return api.get<ChartData>('/dashboard/charts/policies');
  },

  getRecentActivity: (limit: number = 10) => {
    return api.get<ActivityItem[]>(`/dashboard/activity?limit=${limit}`);
  },

  getPremiumTrend: (months: number = 6) => {
    return api.get<ChartItem[]>(`/dashboard/trend/premium?months=${months}`);
  },

  // Additional methods if needed
  getTopAssets: (limit: number = 5) => {
    return api.get(`/dashboard/assets/top?limit=${limit}`);
  },

  getExpiringPolicies: (days: number = 30) => {
    return api.get(`/dashboard/policies/expiring?days=${days}`);
  }
};