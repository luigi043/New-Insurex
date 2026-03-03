import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Refresh,
  Storage,
  Memory,
  Speed,
  Cloud,
} from '@mui/icons-material';
import { dashboardService } from '../../services/dashboard.service';

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  unit: string;
  icon: React.ReactNode;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastCheck: string;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    database: number;
    apiResponse: number;
  };
  services: {
    name: string;
    status: 'online' | 'offline' | 'degraded';
  }[];
}

export const SystemHealthWidget: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadSystemHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemHealth = async () => {
    try {
      const response = await dashboardService.getSystemHealth();
      setHealth(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'success';
      case 'warning':
      case 'degraded':
        return 'warning';
      case 'critical':
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle color="success" />;
      case 'warning':
      case 'degraded':
        return <Warning color="warning" />;
      case 'critical':
      case 'offline':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  const getMetricColor = (value: number): 'success' | 'warning' | 'error' => {
    if (value < 70) return 'success';
    if (value < 85) return 'warning';
    return 'error';
  };

  const metrics: SystemMetric[] = health
    ? [
        {
          name: 'CPU Usage',
          value: health.metrics.cpu,
          status: health.metrics.cpu < 70 ? 'healthy' : health.metrics.cpu < 85 ? 'warning' : 'critical',
          unit: '%',
          icon: <Speed />,
        },
        {
          name: 'Memory',
          value: health.metrics.memory,
          status: health.metrics.memory < 70 ? 'healthy' : health.metrics.memory < 85 ? 'warning' : 'critical',
          unit: '%',
          icon: <Memory />,
        },
        {
          name: 'Disk Space',
          value: health.metrics.disk,
          status: health.metrics.disk < 70 ? 'healthy' : health.metrics.disk < 85 ? 'warning' : 'critical',
          unit: '%',
          icon: <Storage />,
        },
        {
          name: 'Database',
          value: health.metrics.database,
          status: health.metrics.database < 70 ? 'healthy' : health.metrics.database < 85 ? 'warning' : 'critical',
          unit: 'ms',
          icon: <Cloud />,
        },
      ]
    : [];

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading system health...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">System Health</Typography>
          {health && (
            <Chip
              icon={getStatusIcon(health.overall)}
              label={health.overall.toUpperCase()}
              color={getStatusColor(health.overall) as any}
              size="small"
            />
          )}
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={loadSystemHealth} size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {health && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Uptime
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {health.uptime}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Last Check
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {lastUpdate.toLocaleTimeString()}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>
            System Metrics
          </Typography>
          <Grid container spacing={2}>
            {metrics.map((metric) => (
              <Grid item xs={12} sm={6} key={metric.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  {metric.icon}
                  <Typography variant="body2">{metric.name}</Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ ml: 'auto' }}>
                    {metric.value}{metric.unit}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  color={getMetricColor(metric.value)}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, mb: 1 }}>
            Services Status
          </Typography>
          <Grid container spacing={1}>
            {health.services.map((service) => (
              <Grid item xs={12} sm={6} key={service.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(service.status)}
                  <Typography variant="body2">{service.name}</Typography>
                  <Chip
                    label={service.status}
                    size="small"
                    color={getStatusColor(service.status) as any}
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {health.metrics.apiResponse && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Average API Response Time: <strong>{health.metrics.apiResponse}ms</strong>
              </Typography>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default SystemHealthWidget;
