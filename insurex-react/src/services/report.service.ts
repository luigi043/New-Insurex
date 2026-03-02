import api from './api';

export const reportService = {
  async getOverview(period: string = 'month') {
    return {
      data: {
        totalPolicies: 145,
        activePolicies: 128,
        totalClaims: 32,
        pendingClaims: 8,
        totalPremium: 456000,
        totalPayout: 187000,
        growthRate: 12.5,
        claimsRatio: 41.2
      }
    };
  },

  async getPolicyChart(period: string = 'month') {
    return {
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'New Policies',
            data: [12, 19, 15, 17, 24, 23]
          }
        ]
      }
    };
  },

  async getClaimsChart(period: string = 'month') {
    return {
      data: {
        labels: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Paid'],
        values: [15, 8, 12, 3, 9]
      }
    };
  },

  async getRevenueChart(period: string = 'month') {
    return {
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        premium: [45000, 52000, 48000, 56000, 61000, 59000],
        payout: [12000, 18000, 15000, 22000, 19000, 21000]
      }
    };
  }
};
