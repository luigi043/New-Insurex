import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { TrendingUp, Assignment, CheckCircle, Warning, AttachMoney, Inventory } from '@mui/icons-material';
import { policyService } from '../services/policy.service';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalPolicies: 0, activePolicies: 0, totalAssets: 0, totalValue: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const policies = await policyService.getPolicies();
      setStats({
        totalPolicies: policies.totalItems,
        activePolicies: policies.items.filter(p => p.status === 'Active').length,
        totalAssets: 12,
        totalValue: 1500000
      });
    };
    loadStats();
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card><CardContent>
      <Box display="flex" justifyContent="space-between">
        <Box><Typography color="textSecondary">{title}</Typography><Typography variant="h5">{value}</Typography></Box>
        <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
      </Box>
    </CardContent></Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Policies" value={stats.totalPolicies} icon={<Assignment />} color="#1976d2" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Active Policies" value={stats.activePolicies} icon={<CheckCircle />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Assets" value={stats.totalAssets} icon={<Inventory />} color="#9c27b0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Value" value={`$${stats.totalValue.toLocaleString()}`} icon={<AttachMoney />} color="#2e7d32" /></Grid>
      </Grid>
    </Box>
  );
};
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activeClaims: 0,
    recentActivity: [],
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // These endpoints should match what you find in IAPR_API
      const [policiesRes, claimsRes, activityRes] = await Promise.all([
        api.get('/policies/stats'),
        api.get('/claims/stats'),
        api.get('/activity/recent')
      ]);

      setStats({
        totalPolicies: policiesRes.data.totalCount,
        activeClaims: claimsRes.data.activeCount,
        recentActivity: activityRes.data,
        monthlyData: policiesRes.data.monthlyTrend || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.firstName}</h1>
      
      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Policies</h3>
          <p className="text-3xl font-bold">{stats.totalPolicies}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Claims</h3>
          <p className="text-3xl font-bold">{stats.activeClaims}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Approvals</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Due Invoices</h3>
          <p className="text-3xl font-bold">$3,450</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Policy Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 border-b pb-2">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'policy' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <p className="flex-1 text-sm">{activity.description}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-lg mb-2">➕</div>
              <div className="text-sm">New Policy</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-lg mb-2">📝</div>
              <div className="text-sm">Submit Claim</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-lg mb-2">💰</div>
              <div className="text-sm">Pay Invoice</div>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <div className="text-lg mb-2">📊</div>
              <div className="text-sm">View Reports</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;