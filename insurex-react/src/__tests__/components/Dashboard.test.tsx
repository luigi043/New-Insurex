import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock services
vi.mock('../../services/policy.service', () => ({
  policyService: {
    getPolicyStats: vi.fn().mockResolvedValue({
      totalPolicies: 150,
      activePolicies: 120,
      totalPremium: 500000,
    }),
    getExpiringPolicies: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../../services/claim.service', () => ({
  claimService: {
    getClaimStats: vi.fn().mockResolvedValue({
      totalClaims: 45,
      claimsByStatus: { submitted: 5 },
      totalPaid: 150000,
    }),
    getClaims: vi.fn().mockResolvedValue({ items: [] }),
  },
}));

vi.mock('../../services/asset.service', () => ({
  assetService: {
    getAssetStats: vi.fn().mockResolvedValue({
      totalAssets: 200,
      totalValue: 1000000,
    }),
  },
}));

vi.mock('../../services/dashboard.service', () => ({
  dashboardService: {
    getSummary: vi.fn().mockResolvedValue({
      pendingClaims: 5,
      expiringPolicies: 3,
      overdueInvoices: 2,
      pendingReviews: 1,
    }),
    getKPI: vi.fn().mockResolvedValue({
      apiStatus: 'healthy',
      dbStatus: 'healthy',
      storageStatus: 'healthy',
      uptime: 259200,
      responseTime: 45,
      memoryUsage: 62,
      cpuUsage: 35,
    }),
  },
}));

// Mock hooks
vi.mock('../../hooks/useNotification', () => ({
  useNotification: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showNotification: vi.fn(),
    notifications: [],
    hideNotification: vi.fn(),
    clearAll: vi.fn(),
  }),
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { firstName: 'Test', lastName: 'User', email: 'test@test.com' },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Import after mocks
import { Dashboard } from '../../pages/Dashboard/Dashboard';

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the dashboard title', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    renderDashboard();
    // CircularProgress is rendered during loading
    expect(document.querySelector('.MuiCircularProgress-root')).toBeTruthy();
  });

  it('should render auto-refresh controls', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByLabelText('Auto-refresh interval')).toBeInTheDocument();
    });
  });

  it('should render refresh button', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByLabelText('Refresh dashboard data')).toBeInTheDocument();
    });
  });

  it('should render system health widget', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('System Health')).toBeInTheDocument();
    });
  });

  it('should render task summary cards', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Task Summary')).toBeInTheDocument();
    });
  });
});
