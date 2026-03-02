import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { Download } from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { reportService } from '../services/report.service';

const COLORS = ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0'];

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [overview, setOverview] = useState<any>(null);
  const [policyData, setPolicyData] = useState<any>(null);
  const [claimsData, setClaimsData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    const [overviewRes, policyRes, claimsRes, revenueRes] = await Promise.all([
      reportService.getOverview(period),
      reportService.getPolicyChart(period),
      reportService.getClaimsChart(period),
      reportService.getRevenueChart(period)
    ]);
    setOverview(overviewRes.data);
    setPolicyData(policyRes.data);
    setClaimsData(claimsRes.data);
    setRevenueData(revenueRes.data);
  };

  const exportCSV = (type: string) => {
    alert(`Exporting ${type} report...`);
  };

  const pieData = claimsData?.labels.map((label: string, index: number) => ({
    name: label,
    value: claimsData.values[index]
  })) || [];

  const revenueChartData = revenueData?.labels.map((label: string, index: number) => ({
    month: label,
    premium: revenueData.premium[index],
    payout: revenueData.payout[index]
  })) || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportCSV('policies')}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      {overview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Total Policies</Typography>
                <Typography variant="h4">{overview.totalPolicies}</Typography>
                <Typography variant="body2" color="success.main">
                  +{overview.growthRate}% vs last period
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Active Policies</Typography>
                <Typography variant="h4">{overview.activePolicies}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {((overview.activePolicies / overview.totalPolicies) * 100).toFixed(1)}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Total Premium</Typography>
                <Typography variant="h4">${(overview.totalPremium / 1000).toFixed(0)}K</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Claims Ratio</Typography>
                <Typography variant="h4">{overview.claimsRatio}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Premium vs Payout Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Premium vs Payout Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="premium" stroke="#1976d2" />
                <Line type="monotone" dataKey="payout" stroke="#dc004e" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Claims Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Claims by Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Policy Types Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Policies by Type</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={policyData?.datasets[0]?.data.map((value: number, i: number) => ({
                month: policyData.labels[i],
                count: value
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Claims Stats */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Claims Summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 4 }}>
              <Box textAlign="center">
                <Typography variant="h3" color="warning.main">{overview?.pendingClaims}</Typography>
                <Typography color="textSecondary">Pending</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color="success.main">{(overview?.totalClaims - overview?.pendingClaims)}</Typography>
                <Typography color="textSecondary">Processed</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3">{(overview?.totalPayout / 1000).toFixed(0)}K</Typography>
                <Typography color="textSecondary">Paid ($)</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
