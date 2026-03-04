/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Paper,
  List, ListItem, ListItemText, ListItemButton, Chip,
  IconButton, Tooltip, CircularProgress, Button,
} from '@mui/material';
import {
  Assignment, Warning, AttachMoney, Inventory, ArrowForward, Refresh,
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, LineChart, Line,
} from 'recharts';
import { policyService } from '../../services/policy.service';
import { claimService } from '../../services/claim.service';
import { assetService } from '../../services/asset.service';
import { PolicyStats } from '../../types/policy.types';
import { ClaimStats } from '../../types/claim.types';
import { AssetStats } from '../../types/asset.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { MOCK_MONTHLY_PREMIUM, MOCK_CLAIMS_TREND } from '../../services/mock/mockData';

// ---- Chart data & colours ---------------------------------------------------
const PIE_COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

const POLICY_PIE_DATA = [
  { name: 'Comprehensive Auto', value: 2 },
  { name: 'Property', value: 2 },
  { name: 'Commercial', value: 2 },
  { name: 'Third Party', value: 1 },
  { name: 'Life', value: 1 },
];

const CLAIMS_BAR_DATA = [
  { status: 'Submitted', count: 1 },
  { status: 'Under Review', count: 2 },
  { status: 'Approved', count: 1 },
  { status: 'Settled', count: 1 },
  { status: 'Rejected', count: 1 },
];

// ---- Types ------------------------------------------------------------------
interface DashboardStats {
  policies: PolicyStats | null;
  claims: ClaimStats | null;
  assets: AssetStats | null;
  recentClaims: any[];
  expiringPolicies: any[];
}

// ---- Stat Card (outside Dashboard to avoid hook-scope issues) ---------------
function StatCard({
  title,
  value,
  subtitle,
  icon: IconComp,
  color,
  onClick,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType; // eslint-disable-line @typescript-eslint/no-explicit-any
  color: string;
  onClick?: () => void;
}) {
  return (
    <Card
      sx={{ height: '100%', cursor: onClick ? 'pointer' : 'default', '&:hover': onClick ? { boxShadow: 6 } : {} }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" gutterBottom>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>
            )}
          </Box>
          <Box sx={{ backgroundColor: color + '20', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComp sx={{ color, fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ---- Custom pie label -------------------------------------------------------
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ---- Dashboard page ---------------------------------------------------------
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();

  const [stats, setStats] = useState<DashboardStats>({
    policies: null, claims: null, assets: null, recentClaims: [], expiringPolicies: [],
  });
  const [isLoading, setIsLoading] = useState(true);

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
        recentClaims: recentClaimsResponse.data || [],
        expiringPolicies: expiringPolicies || [],
      });
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchDashboardData}><Refresh /></IconButton>
        </Tooltip>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Policies" value={stats.policies?.totalPolicies || 0}
            subtitle={`${stats.policies?.activePolicies || 0} active`}
            icon={Assignment} color="#1976d2" onClick={() => navigate('/policies')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Claims" value={stats.claims?.totalClaims || 0}
            subtitle={`${stats.claims?.pendingClaims || 0} pending`}
            icon={Warning} color="#ed6c02" onClick={() => navigate('/claims')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Assets" value={stats.assets?.totalAssets || 0}
            subtitle={formatCurrency(stats.assets?.totalValue || 0, 'ZAR')}
            icon={Inventory} color="#9c27b0" onClick={() => navigate('/assets')} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Annual Premium" value={formatCurrency(stats.policies?.totalPremium || 0, 'ZAR')}
            subtitle="Total portfolio" icon={AttachMoney} color="#2e7d32" />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Animated Donut Pie Chart */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: 340 }}>
            <Typography variant="h6" gutterBottom>Policy Distribution by Type</Typography>
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={POLICY_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={PieLabel}
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {POLICY_PIE_DATA.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Animated Area Chart – Claims Trend */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: 340 }}>
            <Typography variant="h6" gutterBottom>Claims Trend (Last 6 Months)</Typography>
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={MOCK_CLAIMS_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="claimsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <ReTooltip />
                <Area
                  type="monotone"
                  dataKey="claims"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#claimsGrad)"
                  dot={{ r: 4, fill: '#2563eb' }}
                  isAnimationActive
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Bar Chart – Claims by Status */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>Claims by Status</Typography>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={CLAIMS_BAR_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <ReTooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]}
                  isAnimationActive animationDuration={900} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Line Chart – Monthly Premium */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>Monthly Premium Revenue (ZAR)</Typography>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={MOCK_MONTHLY_PREMIUM} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `R${(v / 1000).toFixed(0)}k`} />
                <ReTooltip formatter={(v: any) => [formatCurrency(Number(v) || 0, 'ZAR'), 'Premium']} />
                <Line
                  type="monotone"
                  dataKey="premium"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                  isAnimationActive
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Lists Row */}
      <Grid container spacing={3}>
        {/* Recent Claims */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Recent Claims</Typography>
              <Button endIcon={<ArrowForward />} onClick={() => navigate('/claims')} size="small">View All</Button>
            </Box>
            <List dense>
              {stats.recentClaims.length === 0 ? (
                <ListItem><ListItemText primary="No recent claims" /></ListItem>
              ) : (
                stats.recentClaims.map((claim) => (
                  <ListItemButton key={claim.id} onClick={() => navigate(`/claims/${claim.id}`)}>
                    <ListItemText
                      primary={claim.claimNumber}
                      secondary={`${claim.holderName || claim.claimantName || ''} - ${formatDate(claim.incidentDate)}`}
                    />
                    <Chip
                      label={claim.status}
                      size="small"
                      color={
                        claim.status === 'APPROVED' ? 'success'
                          : claim.status === 'REJECTED' ? 'error'
                            : claim.status === 'SUBMITTED' ? 'warning'
                              : 'default'
                      }
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Expiring Policies */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Expiring Policies (Next 30 Days)</Typography>
              <Button endIcon={<ArrowForward />} onClick={() => navigate('/policies')} size="small">View All</Button>
            </Box>
            <List dense>
              {stats.expiringPolicies.length === 0 ? (
                <ListItem><ListItemText primary="No policies expiring soon" /></ListItem>
              ) : (
                stats.expiringPolicies.slice(0, 5).map((policy) => (
                  <ListItemButton key={policy.id} onClick={() => navigate(`/policies/${policy.id}`)}>
                    <ListItemText
                      primary={policy.policyNumber}
                      secondary={`${policy.holderName} - ${policy.type}`}
                    />
                    <Typography variant="body2" color="error">
                      Expires {formatDate(policy.endDate)}
                    </Typography>
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

export default Dashboard;
