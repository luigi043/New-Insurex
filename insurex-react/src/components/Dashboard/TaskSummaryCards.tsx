import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Badge,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Assignment,
  Warning,
  Receipt,
  Gavel,
  Schedule,
  CheckCircle,
} from '@mui/icons-material';
import { dashboardService } from '../../services/dashboard.service';

interface TaskCategory {
  id: string;
  label: string;
  count: number;
  urgent: number;
  icon: React.ReactElement;
  color: string;
  path: string;
}

export const TaskSummaryCards: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskCategory[]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const summary = await dashboardService.getSummary();
      setTasks([
        {
          id: 'pending-claims',
          label: 'Pending Claims',
          count: summary?.pendingClaims || 0,
          urgent: Math.min(summary?.pendingClaims || 0, 3),
          icon: <Gavel />,
          color: '#f44336',
          path: '/claims',
        },
        {
          id: 'expiring-policies',
          label: 'Expiring Policies',
          count: summary?.expiringPolicies || 0,
          urgent: Math.min(summary?.expiringPolicies || 0, 2),
          icon: <Schedule />,
          color: '#ff9800',
          path: '/policies',
        },
        {
          id: 'overdue-invoices',
          label: 'Overdue Invoices',
          count: summary?.overdueInvoices || 0,
          urgent: summary?.overdueInvoices || 0,
          icon: <Receipt />,
          color: '#e91e63',
          path: '/billing',
        },
        {
          id: 'pending-reviews',
          label: 'Pending Reviews',
          count: summary?.pendingReviews || 0,
          urgent: 0,
          icon: <Assignment />,
          color: '#2196f3',
          path: '/policies',
        },
      ]);
    } catch {
      // Use fallback empty data
      setTasks([
        { id: 'pending-claims', label: 'Pending Claims', count: 0, urgent: 0, icon: <Gavel />, color: '#f44336', path: '/claims' },
        { id: 'expiring-policies', label: 'Expiring Policies', count: 0, urgent: 0, icon: <Schedule />, color: '#ff9800', path: '/policies' },
        { id: 'overdue-invoices', label: 'Overdue Invoices', count: 0, urgent: 0, icon: <Receipt />, color: '#e91e63', path: '/billing' },
        { id: 'pending-reviews', label: 'Pending Reviews', count: 0, urgent: 0, icon: <Assignment />, color: '#2196f3', path: '/policies' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const totalTasks = tasks.reduce((sum, t) => sum + t.count, 0);
  const totalUrgent = tasks.reduce((sum, t) => sum + t.urgent, 0);

  if (loading) {
    return (
      <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={32} />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">Task Summary</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`${totalTasks} total`}
            size="small"
            variant="outlined"
          />
          {totalUrgent > 0 && (
            <Chip
              icon={<Warning fontSize="small" />}
              label={`${totalUrgent} urgent`}
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={6} key={task.id}>
            <Card
              variant="outlined"
              sx={{
                transition: 'all 0.2s',
                '&:hover': { boxShadow: 2, borderColor: task.color },
              }}
            >
              <CardActionArea
                onClick={() => navigate(task.path)}
                aria-label={`View ${task.label}: ${task.count} items`}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        color: task.color,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {task.count > 0 ? (
                        <Badge badgeContent={task.urgent > 0 ? '!' : undefined} color="error" variant="dot" invisible={task.urgent === 0}>
                          {task.icon}
                        </Badge>
                      ) : (
                        <CheckCircle color="disabled" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {task.label}
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color={task.count > 0 ? task.color : 'text.disabled'}>
                    {task.count}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalTasks === 0 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            All caught up! No pending tasks.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
