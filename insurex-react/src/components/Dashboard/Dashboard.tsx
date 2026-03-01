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
