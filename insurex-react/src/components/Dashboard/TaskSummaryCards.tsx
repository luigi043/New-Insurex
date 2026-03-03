import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  TrendingUp,
  TrendingDown,
  Refresh,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboard.service';

interface TaskSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  dueToday: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

interface TaskCategory {
  id: string;
  title: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  route: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}

export const TaskSummaryCards: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadTaskSummary();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadTaskSummary, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadTaskSummary = async () => {
    try {
      const response = await dashboardService.getTaskSummary();
      setSummary(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load task summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp color="success" fontSize="small" />;
      case 'down':
        return <TrendingDown color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  const taskCategories: TaskCategory[] = summary
    ? [
        {
          id: 'pending',
          title: 'Pending Tasks',
          count: summary.pending,
          color: '#FFA726',
          icon: <Schedule sx={{ fontSize: 40 }} />,
          route: '/tasks?status=pending',
          description: 'Tasks awaiting action',
          priority: 'medium',
        },
        {
          id: 'inProgress',
          title: 'In Progress',
          count: summary.inProgress,
          color: '#42A5F5',
          icon: <Assignment sx={{ fontSize: 40 }} />,
          route: '/tasks?status=in-progress',
          description: 'Currently being worked on',
          priority: 'medium',
        },
        {
          id: 'completed',
          title: 'Completed',
          count: summary.completed,
          color: '#66BB6A',
          icon: <CheckCircle sx={{ fontSize: 40 }} />,
          route: '/tasks?status=completed',
          description: 'Successfully finished',
          priority: 'low',
        },
        {
          id: 'overdue',
          title: 'Overdue',
          count: summary.overdue,
          color: '#EF5350',
          icon: <Warning sx={{ fontSize: 40 }} />,
          route: '/tasks?status=overdue',
          description: 'Requires immediate attention',
          priority: 'high',
        },
      ]
    : [];

  const completionRate = summary
    ? summary.total > 0
      ? Math.round((summary.completed / summary.total) * 100)
      : 0
    : 0;

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading task summary...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Task Summary</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={loadTaskSummary} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {summary && (
        <>
          {/* Overview Card */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h3" fontWeight="bold">
                  {summary.total}
                </Typography>
                <Typography variant="body1">Total Tasks</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2">Completion Rate</Typography>
                    {summary.trend && getTrendIcon(summary.trend.direction)}
                    {summary.trend && (
                      <Typography variant="caption">
                        {summary.trend.percentage}%
                      </Typography>
                    )}
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    sx={{
                      height: 10,
                      borderRadius: 1,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white',
                      },
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {completionRate}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2">Due Today</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {summary.dueToday}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Task Category Cards */}
          <Grid container spacing={3}>
            {taskCategories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  {category.priority === 'high' && (
                    <Chip
                      label="URGENT"
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 10,
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                  <CardActionArea onClick={() => navigate(category.route)}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: category.color + '20',
                            color: category.color,
                          }}
                        >
                          {category.icon}
                        </Box>
                        <ArrowForward sx={{ color: 'text.secondary' }} />
                      </Box>
                      <Typography variant="h3" fontWeight="bold" gutterBottom>
                        {category.count}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {category.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Stats */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {summary.pending + summary.inProgress}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Tasks
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {summary.completed}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {summary.overdue}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Overdue
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {summary.dueToday}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Due Today
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default TaskSummaryCards;
