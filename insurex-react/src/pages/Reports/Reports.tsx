import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { reportService } from '../services/report.service';

const COLORS = ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0'];

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [overview, setOverview] = useState<any>(null);
  const [policyData, setPolicyData] = useState<any>(null);
  const [claimsData, setClaimsData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      reportService.getOverview(period),
      reportService.getPolicyChart(period),
      reportService.getClaimsChart(period),
      reportService.getRevenueChart(period)
    ]).then(([o, p, c, r]) => {
      setOverview(o);
      setPolicyData(p);
      setClaimsData(c);
      setRevenueData(r);
    });
  }, [period]);

  const pieData = claimsData?.labels.map((l: string, i: number) => ({ name: l, value: claimsData.values[i] })) || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Reports</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="week">This Week</MenuItem><MenuItem value="month">This Month</MenuItem><MenuItem value="quarter">This Quarter</MenuItem><MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {overview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={3}><Card><CardContent><Typography color="textSecondary">Total Policies</Typography><Typography variant="h4">{overview.totalPolicies}</Typography></CardContent></Card></Grid>
          <Grid item xs={3}><Card><CardContent><Typography color="textSecondary">Active Policies</Typography><Typography variant="h4">{overview.activePolicies}</Typography></CardContent></Card></Grid>
          <Grid item xs={3}><Card><CardContent><Typography color="textSecondary">Total Premium</Typography><Typography variant="h4">${(overview.totalPremium / 1000).toFixed(0)}K</Typography></CardContent></Card></Grid>
          <Grid item xs={3}><Card><CardContent><Typography color="textSecondary">Claims Ratio</Typography><Typography variant="h4">{overview.claimsRatio}%</Typography></CardContent></Card></Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={8}><Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>Premium vs Payout</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData?.labels.map((l: string, i: number) => ({ month: l, premium: revenueData.premium[i], payout: revenueData.payout[i] })) || []}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
              <Line type="monotone" dataKey="premium" stroke="#1976d2" /><Line type="monotone" dataKey="payout" stroke="#dc004e" />
            </LineChart>
          </ResponsiveContainer>
        </Paper></Grid>
        <Grid item xs={4}><Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>Claims by Status</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" label={(e) => e.name} outerRadius={80} dataKey="value">
              {pieData.map((e: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </Paper></Grid>
      </Grid>
    </Box>
  );
};
