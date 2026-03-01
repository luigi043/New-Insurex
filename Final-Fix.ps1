# fix-react-files.ps1
# Run this script from the insurex-react directory

Write-Host "🔧 Fixing React files..." -ForegroundColor Cyan

# Set the correct path
$reactPath = "C:\Users\cluiz\source\repos\New folder\New-Insurex\insurex-react"
Set-Location $reactPath

# Function to write file with proper encoding
function Write-FileWithContent {
    param(
        [string]$FilePath,
        [string]$Content
    )
    
    # Create directory if it doesn't exist
    $directory = Split-Path $FilePath -Parent
    if (!(Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    
    # Write file with UTF8 encoding without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($FilePath, $Content, $utf8NoBom)
    Write-Host "  ✅ Created $FilePath" -ForegroundColor Green
}

# Create api.ts
$apiContent = @'
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const auth = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  test: () => api.get('/auth/test'),
  health: () => api.get('/auth/health'),
  info: () => api.get('/auth/info'),
};

export default api;
'@
Write-FileWithContent -FilePath "src/services/api.ts" -Content $apiContent

# Create policyApi.ts
$policyApiContent = @'
import api from './api';

export const policyApi = {
  getAll: (params?: any) => api.get('/policy', { params }),
  getById: (id: string) => api.get(`/policy/${id}`),
  create: (data: any) => api.post('/policy', data),
  update: (id: string, data: any) => api.put(`/policy/${id}`, { ...data, id }),
  delete: (id: string) => api.delete(`/policy/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/policy/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getExpiring: (days: number = 30) => api.get('/policy/expiring', { params: { days } })
};
'@
Write-FileWithContent -FilePath "src/services/policyApi.ts" -Content $policyApiContent

# Create dashboardApi.ts (if needed)
$dashboardApiContent = @'
import api from './api';

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getPolicyChartData: () => api.get('/dashboard/charts/policy-status'),
  getRecentActivity: (count = 10) => api.get('/dashboard/recent-activity', { params: { count } }),
  getPremiumTrend: (months = 6) => api.get('/dashboard/premium-trend', { params: { months } }),
  getExpiringChart: () => api.get('/dashboard/expiring-chart')
};
'@
Write-FileWithContent -FilePath "src/services/dashboardApi.ts" -Content $dashboardApiContent

# Create Dashboard.tsx
$dashboardContent = @'
import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../services/dashboardApi';
import './Dashboard.css';

interface SummaryData {
  totalPolicies: number;
  activePolicies: number;
  expiringSoon: number;
  totalAssets: number;
  totalInsuredValue: number;
  pendingClaims: number;
}

interface ChartItem {
  label: string;
  value: number;
  amount?: number;
}

interface ChartData {
  byStatus: ChartItem[];
  byType: ChartItem[];
  byMonth: ChartItem[];
}

interface ActivityItem {
  activityType: string;
  description: string;
  reference: string;
  timestamp: string;
  user: string;
}

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [premiumTrend, setPremiumTrend] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summaryRes, chartRes, activityRes, trendRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getPolicyChartData(),
        dashboardApi.getRecentActivity(10),
        dashboardApi.getPremiumTrend(6)
      ]);

      setSummary(summaryRes.data);
      setChartData(chartRes.data);
      setRecentActivity(activityRes.data);
      setPremiumTrend(trendRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const maxStatusValue = chartData?.byStatus && chartData.byStatus.length > 0 
    ? Math.max(...chartData.byStatus.map(i => i.value)) 
    : 1;
    
  const maxTrendAmount = premiumTrend && premiumTrend.length > 0 
    ? Math.max(...premiumTrend.map(i => i.amount || 0)) 
    : 1;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="summary-cards">
        <div className="card">
          <h3>Total Policies</h3>
          <p className="card-value">{summary?.totalPolicies || 0}</p>
        </div>
        <div className="card">
          <h3>Active Policies</h3>
          <p className="card-value">{summary?.activePolicies || 0}</p>
        </div>
        <div className="card warning">
          <h3>Expiring Soon</h3>
          <p className="card-value">{summary?.expiringSoon || 0}</p>
        </div>
        <div className="card">
          <h3>Total Assets</h3>
          <p className="card-value">{summary?.totalAssets || 0}</p>
        </div>
        <div className="card highlight">
          <h3>Total Insured</h3>
          <p className="card-value">
            ${summary?.totalInsuredValue?.toLocaleString() || 0}
          </p>
        </div>
        <div className="card">
          <h3>Pending Claims</h3>
          <p className="card-value">{summary?.pendingClaims || 0}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Policy Status</h3>
          <div className="chart-placeholder">
            {chartData?.byStatus?.map((item) => {
              const width = maxStatusValue > 0 
                ? (item.value / maxStatusValue) * 100 
                : 0;
              return (
                <div key={item.label} className="chart-item">
                  <span>{item.label}: {item.value}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: width + '%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-container">
          <h3>Policy Types</h3>
          <div className="pie-chart-placeholder">
            {chartData?.byType?.map((item) => (
              <div key={item.label} className="legend-item">
                <span 
                  className="color-dot" 
                  style={{ 
                    backgroundColor: item.label === 'Personal' 
                      ? '#007bff' 
                      : '#28a745' 
                  }} 
                />
                <span>{item.label}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Premium Trend (6 Months)</h3>
          <div className="trend-chart">
            {premiumTrend.map((item, index) => {
              const height = maxTrendAmount > 0 
                ? ((item.amount || 0) / maxTrendAmount) * 150 
                : 0;
              return (
                <div key={index} className="trend-bar-container">
                  <div 
                    className="trend-bar" 
                    style={{ height: height + 'px' }}
                  />
                  <span className="trend-label">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Activity</th>
              <th>Description</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity, index) => (
              <tr key={index}>
                <td>{new Date(activity.timestamp).toLocaleString()}</td>
                <td>
                  <span className={'activity-badge ' + (activity.activityType === 'Policy Created' ? 'policy' : 'claim')}>
                    {activity.activityType}
                  </span>
                </td>
                <td>{activity.description}</td>
                <td>{activity.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
'@
Write-FileWithContent -FilePath "src/components/Dashboard/Dashboard.tsx" -Content $dashboardContent

# Create PolicyList.tsx
$policyListContent = @'
import React, { useState, useEffect, useCallback } from 'react';
import { policyApi } from '../../services/policyApi';
import './PolicyList.css';

interface Policy {
  id: string;
  policyNumber: string;
  policyType: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  premium: number;
  insuredValue: number;
  status: string;
  paymentStatus: string;
  assetCount: number;
}

interface PolicyListProps {
  onSelectPolicy?: (policy: Policy) => void;
  onEditPolicy?: (policy: Policy) => void;
}

const PolicyList: React.FC<PolicyListProps> = ({ onSelectPolicy, onEditPolicy }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await policyApi.getAll();
      setPolicies(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading policies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const getStatusClass = (policyStatus: string): string => {
    switch (policyStatus) {
      case 'Active': return 'status-active';
      case 'Suspended': return 'status-suspended';
      case 'Cancelled': return 'status-cancelled';
      case 'Expired': return 'status-expired';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading policies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="policy-list-container">
      <h2>Policy Management</h2>
      <div className="policy-table-container">
        <table className="policy-table">
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Type</th>
              <th>Partner</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Premium</th>
              <th>Insured Value</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Assets</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.policyNumber}</td>
                <td>{policy.policyType}</td>
                <td>{policy.partnerName}</td>
                <td>{new Date(policy.startDate).toLocaleDateString()}</td>
                <td>{new Date(policy.endDate).toLocaleDateString()}</td>
                <td>${policy.premium.toLocaleString()}</td>
                <td>${policy.insuredValue.toLocaleString()}</td>
                <td>
                  <span className={'status-badge ' + getStatusClass(policy.status)}>
                    {policy.status}
                  </span>
                </td>
                <td>
                  <span className={'payment-status ' + (policy.paymentStatus === 'Paid' ? 'paid' : 'pending')}>
                    {policy.paymentStatus}
                  </span>
                </td>
                <td>{policy.assetCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicyList;
'@
Write-FileWithContent -FilePath "src/components/Policy/PolicyList.tsx" -Content $policyListContent

Write-Host "`n✅ All files have been fixed successfully!" -ForegroundColor Green
Write-Host "Now run 'npm start' to start the React app." -ForegroundColor Yellow