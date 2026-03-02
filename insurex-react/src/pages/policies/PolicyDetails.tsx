import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Grid, Chip, Button, IconButton, Divider } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { policyService } from '../services/policy.service';
import { Policy } from '../types/policy.types';

export const PolicyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    policyService.getPolicy(id!).then(setPolicy);
  }, [id]);

  if (!policy) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/policies')}><ArrowBack /></IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1, ml: 2 }}>Policy Details</Typography>
        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/policies/edit/${id}`)}>Edit</Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}><Typography variant="h5">{policy.policyNumber} - {policy.name}</Typography></Grid>
          <Grid item xs={12}><Divider /></Grid>
          <Grid item xs={6}><Typography color="textSecondary">Type</Typography><Typography>{policy.type}</Typography></Grid>
          <Grid item xs={6}><Typography color="textSecondary">Status</Typography><Chip label={policy.status} color={policy.status === 'Active' ? 'success' : 'default'} /></Grid>
          <Grid item xs={6}><Typography color="textSecondary">Coverage Amount</Typography><Typography>${policy.coverageAmount.toLocaleString()}</Typography></Grid>
          <Grid item xs={6}><Typography color="textSecondary">Premium</Typography><Typography>${policy.premium.toLocaleString()}</Typography></Grid>
          <Grid item xs={6}><Typography color="textSecondary">Start Date</Typography><Typography>{new Date(policy.startDate).toLocaleDateString()}</Typography></Grid>
          <Grid item xs={6}><Typography color="textSecondary">End Date</Typography><Typography>{new Date(policy.endDate).toLocaleDateString()}</Typography></Grid>
          <Grid item xs={12}><Typography color="textSecondary">Description</Typography><Typography>{policy.description || 'No description'}</Typography></Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
