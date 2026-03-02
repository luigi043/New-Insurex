import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { TrendingUp, Assignment, CheckCircle, Warning, AttachMoney, Inventory, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { policyService } from '../services/policy.service';
import { claimService } from '../services/claim.service';
import { assetService } from '../services/asset.service';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
    totalAssets: 0,
    totalValue: 0,
    recentClaims: [] as any[],
    expiringPolicies: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [policies, claims, assets, expiring] = await Promise.all([
          policyService.getPolicies(1, 100),
          claimService.getClaims(1, 100),
          assetService.getAssets(1, 100),
          policyService.getExpiringPolicies(30)
        ]);

        setStats({
          totalPolicies: policies.totalItems,
          activePolicies: policies.items.filter((p: any) => p.status === 'active').length,
          totalClaims: claims.totalItems,
          pendingClaims: claims.items.filter((c: any) => c.status === 'submitted' || c.status === 'under_review').length,
          totalAssets: assets.totalItems,
          totalValue: assets.items.reduce((sum: number, a: any) => sum + (a.value || 0), 0),
          recentClaims: claims.items.slice(0, 5),
          expiringPolicies: expiring.slice(0, 5)
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }: any) => (
    <Card sx={{ height: '100%', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>{title}</Typography>
            <Typography variant="h4" fontWeight="bold">{value}</Typography>
            {subtitle && <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
          </Box>
          <Box sx={{ backgroundColor: `${color}20`, borderRadius: 2, p: 1 }}>
            <Icon sx={{ color, fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Policies" 
            value={stats.totalPolicies} 
            subtitle={`${stats.activePolicies} active`}
            icon={Assignment} 
            color="#1976d2" 
            onClick={() => navigate('/policies')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Claims" 
            value={stats.totalClaims} 
            subtitle={`${stats.pendingClaims} pending`}
            icon={Warning} 
            color="#ed6c02" 
            onClick={() => navigate('/claims')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Assets" 
            value={stats.totalAssets} 
            subtitle={formatCurrency(stats.totalValue)}
            icon={Inventory} 
            color="#9c27b0" 
            onClick={() => navigate('/assets')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Expiring Soon" 
            value={stats.expiringPolicies.length} 
            subtitle="Within 30 days"
            icon={TrendingUp} 
            color="#2e7d32" 
            onClick={() => navigate('/policies')}
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Claims</Typography>
              <Button endIcon={<ArrowForward />} onClick={() => navigate('/claims')} size="small">
                View All
              </Button>
            </Box>
            <List dense>
              {stats.recentClaims.length === 0 ? (
                <ListItem><ListItemText primary="No recent claims" /></ListItem>
              ) : (
                stats.recentClaims.map((claim: any) => (
                  <ListItem key={claim.id} button onClick={() => navigate(`/claims/${claim.id}`)}>
                    <ListItemText 
                      primary={claim.claimNumber} 
                      secondary={`${claim.claimantName} - ${formatDate(claim.incidentDate)}`}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(claim.estimatedAmount, claim.currency)}
                    </Typography>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Expiring Policies</Typography>
              <Button endIcon={<ArrowForward />} onClick={() => navigate('/policies')} size="small">
                View All
              </Button>
            </Box>
            <List dense>
              {stats.expiringPolicies.length === 0 ? (
                <ListItem><ListItemText primary="No policies expiring soon" /></ListItem>
              ) : (
                stats.expiringPolicies.map((policy: any) => (
                  <ListItem key={policy.id} button onClick={() => navigate(`/policies/${policy.id}`)}>
                    <ListItemText 
                      primary={policy.policyNumber} 
                      secondary={`${policy.holderName} - ${policy.type}`}
                    />
                    <Typography variant="body2" color="error">
                      Expires {formatDate(policy.endDate)}
                    </Typography>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
