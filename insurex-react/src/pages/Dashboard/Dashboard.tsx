import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  FormControl,
<<<<<<< HEAD
  Select,
  MenuItem,
=======

  Select,

  MenuItem,

>>>>>>> main
  SelectChangeEvent,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  CheckCircle,
  Warning,
  AttachMoney,
  Inventory,
  Claim,
   Autorenew,
  ArrowForward,
  Refresh,
  Autorenew,
} from '@mui/icons-material';
import { SystemHealthWidget } from '../../components/Dashboard/SystemHealthWidget';
import { TaskSummaryCards } from '../../components/Dashboard/TaskSummaryCards';
import { policyService } from '../../services/policy.service';
import { claimService } from '../../services/claim.service';


import { SystemHealthWidget } from '../../components/Dashboard/SystemHealthWidget';

import { TaskSummaryCards } from '../../components/Dashboard/TaskSummaryCards';
import { assetService } from '../../services/asset.service';
import { PolicyStats } from '../../types/policy.types';
import { ClaimStats } from '../../types/claim.types';
import { AssetStats } from '../../types/asset.types';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';

interface DashboardStats {
  policies: PolicyStats | null;
  claims: ClaimStats | null;
  assets: AssetStats | null;
  recentClaims: any[];
  expiringPolicies: any[];
} const [refreshInterval, setRefreshInterval] = useState<number>(0);

  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

 

  const handleRefreshIntervalChange = (event: SelectChangeEvent<number>) => {

    setRefreshInterval(Number(event.target.value));

  };

 

  useEffect(() => {

    if (intervalRef.current) {

      clearInterval(intervalRef.current);

      intervalRef.current = null;

    }

    if (refreshInterval > 0) {

      intervalRef.current = setInterval(() => {

        fetchDashboardData();

      }, refreshInterval * 1000);

    }

    return () => {

      if (intervalRef.current) {

        clearInterval(intervalRef.current);

      }

    };

  }, [refreshInterval]);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  
  const [stats, setStats] = useState<DashboardStats>({
    policies: null,
    claims: null,
    assets: null,
    recentClaims: [],
    expiringPolicies: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRefreshIntervalChange = (event: SelectChangeEvent<number>) => {
    setRefreshInterval(Number(event.target.value));
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchDashboardData();
      }, refreshInterval * 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [policyStats, claimStats, assetStats, expiringPolicies] = await Promise.all([
        policyService.getPolicyStats(),
        claimService.getClaimStats(),
        assetService.getAssetStats(),
        policyService.getExpiringPolicies(30),
      ]);

      const recentClaimsResponse = await claimService.getClaims(1, 5);

      setStats({
        policies: policyStats,
        claims: claimStats,
        assets: assetStats,
        recentClaims: recentClaimsResponse.items,
        expiringPolicies: expiringPolicies,
      });
      setLastRefreshed(new Date());
    } catch (err: any) {
      showError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    onClick,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
    onClick?: () => void;
  }) => (
    <Card sx={{ height: '100%', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: color + '20',
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color, fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
              displayEmpty
              startAdornment={<Autorenew fontSize="small" sx={{ mr: 0.5, color: refreshInterval > 0 ? 'primary.main' : 'text.disabled' }} />}
              aria-label="Auto-refresh interval"
            >
              <MenuItem value={0}>Manual</MenuItem>
              <MenuItem value={15}>Every 15s</MenuItem>
              <MenuItem value={30}>Every 30s</MenuItem>
              <MenuItem value={60}>Every 1m</MenuItem>
              <MenuItem value={300}>Every 5m</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh now">
            <IconButton onClick={fetchDashboardData} aria-label="Refresh dashboard data">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Policies"
            value={stats.policies?.totalPolicies || 0}
            subtitle={`${stats.policies?.activePolicies || 0} active`}
            icon={Assignment}
            color="#1976d2"
            onClick={() => navigate('/policies')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Claims"
            value={stats.claims?.totalClaims || 0}
            subtitle="This year"
            icon={Claim}
            color="#ed6c02"
            onClick={() => navigate('/claims')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assets"
            value={stats.assets?.totalAssets || 0}
            subtitle={formatCurrency(stats.assets?.totalValue || 0)}
            icon={Inventory}
            color="#9c27b0"
            onClick={() => navigate('/assets')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Premium"
            value={formatCurrency(stats.policies?.totalPremium || 0)}
            subtitle="Annual"
            icon={AttachMoney}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Claims"
            value={stats.claims?.claimsByStatus?.submitted || 0}
            subtitle="Awaiting review"
            icon={Warning}
            color="#f44336"
            onClick={() => navigate('/claims', { state: { filter: 'submitted' } })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Expiring Soon"
            value={stats.expiringPolicies?.length || 0}
            subtitle="Within 30 days"
            icon={TrendingUp}
            color="#0288d1"
            onClick={() => navigate('/policies', { state: { filter: 'expiring' } })}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Paid"
            value={formatCurrency(stats.claims?.totalPaid || 0)}
            subtitle="Claims settled"
            icon={CheckCircle}
            color="#388e3c"
          />
        </Grid>
      </Grid>

      {/* System Health & Task Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <SystemHealthWidget />
        </Grid>
        <Grid item xs={12} md={6}>
          <TaskSummaryCards />
        </Grid>
      </Grid>

      {/* Lists */}
      <Grid container spacing={3}>
        {/* Recent Claims */}
        <Grid item xs={12} md={6}>
          <Paper>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Recent Claims</Typography>
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate('/claims')}
                size="small"
              >
                View All
              </Button>
            </Box>
            <List dense>
              {stats.recentClaims.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No recent claims" />
                </ListItem>
              ) : (
                stats.recentClaims.map((claim) => (
                  <ListItemButton
                    key={claim.id}
                    onClick={() => navigate(`/claims/${claim.id}`)}
                  >
                    <ListItemText
                      primary={claim.claimNumber}
                      secondary={`${claim.claimantName} - ${formatDate(claim.incidentDate)}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={claim.status}
                        size="small"
                        color={
                          claim.status === 'approved'
                            ? 'success'
                            : claim.status === 'rejected'
                            ? 'error'
                            : claim.status === 'submitted'
                            ? 'warning'
                            : 'default'
                        }
                      />
                      <Typography variant="body2">
                        {formatCurrency(claim.estimatedAmount, claim.currency)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Expiring Policies */}
        <Grid item xs={12} md={6}>
          <Paper>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Expiring Policies</Typography>
              <Button
                endIcon={<ArrowForward />}
                onClick={() => navigate('/policies')}
                size="small"
              >
                View All
              </Button>
            </Box>
            <List dense>
              {stats.expiringPolicies.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No policies expiring soon" />
                </ListItem>
              ) : (
                stats.expiringPolicies.slice(0, 5).map((policy) => (
                  <ListItemButton
                    key={policy.id}
                    onClick={() => navigate(`/policies/${policy.id}`)}
                  >
                    <ListItemText
                      primary={policy.policyNumber}
                      secondary={`${policy.holderName} - ${policy.type}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="error">
                        Expires {formatDate(policy.endDate)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
