import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  Description,
  Receipt,
  History,
} from '@mui/icons-material';
import { policyService } from '../../services/policy.service';
import { Policy, PolicyStatus } from '../../types/policy.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`policy-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const PolicyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadPolicy();
  }, [id]);

  const loadPolicy = async () => {
    try {
      setLoading(true);
      const data = await policyService.getPolicy(id!);
      setPolicy(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load policy');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await policyService.deletePolicy(id!);
        navigate('/policies');
      } catch (err: any) {
        setError(err.message || 'Failed to delete policy');
      }
    }
  };

  const getStatusColor = (status: PolicyStatus) => {
    switch (status) {
      case PolicyStatus.Active: return 'success';
      case PolicyStatus.Draft: return 'default';
      case PolicyStatus.PendingApproval: return 'warning';
      case PolicyStatus.Expired: return 'error';
      case PolicyStatus.Cancelled: return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !policy) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Policy not found'}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/policies')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Policy Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/policies/edit/${id}`)}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>

      {/* Status Banner */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">{policy.policyNumber}</Typography>
            <Typography variant="body1">{policy.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Chip
              label={policy.status}
              color={getStatusColor(policy.status) as any}
              sx={{ fontWeight: 'bold', color: 'white' }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Overview" />
          <Tab label="Assets" />
          <Tab label="Claims" />
          <Tab label="Documents" />
          <Tab label="History" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Policy Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" variant="body2">
                    Policy Type
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {policy.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" variant="body2">
                    Coverage Amount
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${policy.coverageAmount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" variant="body2">
                    Premium
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${policy.premium.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" variant="body2">
                    Premium Ratio
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {((policy.premium / policy.coverageAmount) * 100).toFixed(2)}%
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" variant="body2">
                    Start Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(policy.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography color="textSecondary" variant="body2">
                    End Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(policy.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                {policy.description && (
                  <Grid item xs={12}>
                    <Typography color="textSecondary" variant="body2">
                      Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {policy.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Client Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {policy.client ? (
                <>
                  <Typography variant="body1">
                    {policy.client.firstName} {policy.client.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {policy.client.email}
                  </Typography>
                </>
              ) : (
                <Typography color="textSecondary">No client information</Typography>
              )}
            </Paper>

            {policy.insurer && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Insurer Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="body1">
                  {policy.insurer.firstName} {policy.insurer.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {policy.insurer.email}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      {/* Assets Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Covered Assets</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/assets/new', { state: { policyId: policy.id } })}
            >
              Add Asset
            </Button>
          </Box>

          {policy.assets && policy.assets.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {policy.assets.map((asset: any) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>${asset.value?.toLocaleString()}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={asset.status}
                          size="small"
                          color={asset.status === 'Active' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Description />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              No assets covered under this policy
            </Typography>
          )}
        </Paper>
      </TabPanel>

      {/* Other tabs - placeholders */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography>Claims history will be displayed here</Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography>Policy documents will be displayed here</Typography>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Paper sx={{ p: 3 }}>
          <Typography>Policy history and audit trail will be displayed here</Typography>
        </Paper>
      </TabPanel>
    </Box>
  );
};
