import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, List, ListItem, ListItemText, Button } from '@mui/material';
import { TrendingUp, Assignment, Warning, Inventory, ArrowForward } from '@mui/icons-material';
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
        const [policies, claims, assets] = await Promise.all([
          policyService.getAll(undefined, 1, 100),
          claimService.getAll(undefined, 1, 100),
          assetService.getAll(undefined, 1, 100),
        ]);

        setStats({
          totalPolicies: policies.total,
          activePolicies: policies.data.filter((p: any) => p.status?.toLowerCase() === 'active').length,
          totalClaims: claims.total,
          pendingClaims: claims.data.filter((c: any) => ['submitted', 'under_review', 'pending_info'].includes(c.status?.toLowerCase() || '')).length,
          totalAssets: assets.total,
          totalValue: assets.data.reduce((sum: number, a: any) => sum + (a.value || 0), 0),
          recentClaims: claims.data.slice(0, 5),
          expiringPolicies: policies.data.filter((p: any) => {
            const endDate = new Date(p.endDate);
            const now = new Date();
            const diff = (endDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
            return diff > 0 && diff < 30;
          }).slice(0, 5)
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
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          '& .icon-box': {
            background: color,
            '& .MuiSvgIcon-root': { color: '#fff' }
          }
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="overline" fontWeight="bold" letterSpacing={1}>{title}</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>{value}</Typography>
            {subtitle && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
              </Box>
            )}
          </Box>
          <Box
            className="icon-box"
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '12px',
              p: 1.5,
              transition: 'all 0.3s ease'
            }}
          >
            <Icon sx={{ color, fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Dashboard Overview</Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Policies"
            value={stats.totalPolicies}
            subtitle={`${stats.activePolicies} active`}
            icon={Assignment}
            color="#2563eb"
            onClick={() => navigate('/policies')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Claims"
            value={stats.totalClaims}
            subtitle={`${stats.pendingClaims} pending`}
            icon={Warning}
            color="#f59e0b"
            onClick={() => navigate('/claims')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            subtitle={formatCurrency(stats.totalValue)}
            icon={Inventory}
            color="#7c3aed"
            onClick={() => navigate('/assets')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expiring Soon"
            value={stats.expiringPolicies.length}
            subtitle="Within 30 days"
            icon={TrendingUp}
            color="#10b981"
            onClick={() => navigate('/policies')}
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Recent Claims</Typography>
              <Button endIcon={<ArrowForward />} onClick={() => navigate('/claims')} size="small">
                View All
              </Button>
            </Box>
            <List dense>
              {stats.recentClaims.length === 0 ? (
                <ListItem><ListItemText primary="No recent claims" /></ListItem>
              ) : (
                stats.recentClaims.map((claim: any) => (
                  <ListItem
                    key={claim.id}
                    disableGutters
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                      <Box sx={{ cursor: 'pointer' }} onClick={() => navigate(`/claims/${claim.id}`)}>
                        <Typography variant="subtitle2" fontWeight="bold">{claim.claimNumber}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {claim.claimantName} • {formatDate(claim.incidentDate)}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {formatCurrency(claim.claimedAmount)}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Expiring Policies</Typography>
              <Button endIcon={<ArrowForward />} onClick={() => navigate('/policies')} size="small">
                View All
              </Button>
            </Box>
            <List dense>
              {stats.expiringPolicies.length === 0 ? (
                <ListItem><ListItemText primary="No policies expiring soon" /></ListItem>
              ) : (
                stats.expiringPolicies.map((policy: any) => (
                  <ListItem
                    key={policy.id}
                    disableGutters
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                      <Box sx={{ cursor: 'pointer' }} onClick={() => navigate(`/policies/${policy.id}`)}>
                        <Typography variant="subtitle2" fontWeight="bold">{policy.policyNumber}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {policy.holderName} • {policy.type}
                        </Typography>
                      </Box>
                      <Typography variant="caption" fontWeight="bold" color="error.main">
                        {formatDate(policy.endDate)}
                      </Typography>
                    </Box>
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
