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
