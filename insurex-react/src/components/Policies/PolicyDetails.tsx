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
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  Description,
} from '@mui/icons-material';
import { policyService } from '../../services/policy.service';

export const PolicyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicy();
  }, [id]);

  const loadPolicy = async () => {
    try {
      const response = await policyService.getPolicy(id!);
      setPolicy(response.data);
    } catch (error) {
      console.error('Failed to load policy:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Expired': return 'error';
      case 'Draft': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!policy) {
    return <Typography>Policy not found</Typography>;
  }

  return (
    <Box>
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
        >
          Delete
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Policy Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Policy Information</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Policy Number</Typography>
                <Typography variant="body1" gutterBottom>{policy.policyNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Name</Typography>
                <Typography variant="body1" gutterBottom>{policy.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">Description</Typography>
                <Typography variant="body1" gutterBottom>{policy.description}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">Type</Typography>
                <Typography variant="body1" gutterBottom>{policy.type}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">Status</Typography>
                <Chip
                  label={policy.status}
                  color={getStatusColor(policy.status) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">Coverage Amount</Typography>
                <Typography variant="body1" gutterBottom>${policy.coverageAmount?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">Premium</Typography>
                <Typography variant="body1" gutterBottom>${policy.premium?.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">Start Date</Typography>
                <Typography variant="body1" gutterBottom>{new Date(policy.startDate).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary">End Date</Typography>
                <Typography variant="body1" gutterBottom>{new Date(policy.endDate).toLocaleDateString()}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Client Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Client Information</Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="textSecondary">Name</Typography>
            <Typography variant="body1" gutterBottom>
              {policy.client?.firstName} {policy.client?.lastName}
            </Typography>

            <Typography variant="body2" color="textSecondary">Email</Typography>
            <Typography variant="body1" gutterBottom>{policy.client?.email}</Typography>

            <Typography variant="body2" color="textSecondary">Phone</Typography>
            <Typography variant="body1" gutterBottom>{policy.client?.phoneNumber}</Typography>

            {policy.insurer && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Insurer Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="textSecondary">Name</Typography>
                <Typography variant="body1" gutterBottom>
                  {policy.insurer?.firstName} {policy.insurer?.lastName}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Assets */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Covered Assets</Typography>
            <Divider sx={{ mb: 2 }} />

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
                  {policy.assets?.length > 0 ? (
                    policy.assets.map((asset: any) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No assets covered</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};