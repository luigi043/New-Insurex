import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Chip, Button, Divider, List, ListItem, ListItemText, CircularProgress, Alert, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Edit, Delete, ArrowBack, CheckCircle, Cancel, PlayArrow } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import { Claim, ClaimStatus } from '../../types/claim.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';

export const ClaimDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'submit' | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => { if (id) fetchClaim(id); }, [id]);

  const fetchClaim = async (claimId: string) => {
    setIsLoading(true);
    try {
      const data = await claimService.getClaim(claimId);
      setClaim(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch claim details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await claimService.deleteClaim(id);
      showSuccess('Claim deleted successfully');
      navigate('/claims');
    } catch (err: any) {
      showError(err.message || 'Failed to delete claim');
    }
  };

  const handleAction = async () => {
    if (!id || !actionType) return;
    try {
      await claimService.workflowAction(id, { action: actionType, notes: actionNotes });
      showSuccess(`Claim ${actionType}d successfully`);
      setActionDialogOpen(false);
      setActionNotes('');
      fetchClaim(id);
    } catch (err: any) {
      showError(err.message || `Failed to ${actionType} claim`);
    }
  };

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'approved': case 'settled': case 'partially_approved': return 'success';
      case 'rejected': return 'error';
      case 'submitted': case 'under_review': case 'pending_info': return 'warning';
      case 'in_payment': return 'info';
      default: return 'default';
    }
  };

  const openActionDialog = (action: 'approve' | 'reject' | 'submit') => {
    setActionType(action);
    setActionDialogOpen(true);
  };

  if (isLoading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>);
  if (error || !claim) return (<Alert severity="error" sx={{ mb: 2 }}>{error || 'Claim not found'}</Alert>);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/claims')}>Back</Button>
          <Typography variant="h4">Claim Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {claim.status === 'draft' && (
            <Button variant="contained" color="success" startIcon={<PlayArrow />} onClick={() => openActionDialog('submit')}>Submit</Button>
          )}
          {claim.status === 'under_review' && (
            <>
              <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => openActionDialog('approve')}>Approve</Button>
              <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => openActionDialog('reject')}>Reject</Button>
            </>
          )}
          <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/claims/edit/${id}`)}>Edit</Button>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h5" gutterBottom>{claim.claimNumber}</Typography>
                <Chip label={claim.status.toUpperCase()} color={getStatusColor(claim.status)} />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Claim Type</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{claim.type.replace('_', ' ')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Policy</Typography>
                <Typography variant="body1">{claim.policyNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Claimant</Typography>
                <Typography variant="body1">{claim.claimantName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Incident Date</Typography>
                <Typography variant="body1">{formatDate(claim.incidentDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Reported Date</Typography>
                <Typography variant="body1">{formatDate(claim.reportedDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                <Typography variant="body1">{claim.location || '-'}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Description</Typography>
            <Typography variant="body1">{claim.description}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Financial Summary</Typography>
              <List dense>
                <ListItem><ListItemText primary="Estimated Amount" secondary={formatCurrency(claim.estimatedAmount, claim.currency)} /></ListItem>
                <ListItem><ListItemText primary="Approved Amount" secondary={claim.approvedAmount ? formatCurrency(claim.approvedAmount, claim.currency) : '-'} /></ListItem>
                <ListItem><ListItemText primary="Paid Amount" secondary={claim.paidAmount ? formatCurrency(claim.paidAmount, claim.currency) : '-'} /></ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog open={deleteDialogOpen} title="Delete Claim" message="Are you sure you want to delete this claim? This action cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteDialogOpen(false)} />

      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{actionType?.charAt(0).toUpperCase()}{actionType?.slice(1)} Claim</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Notes" fullWidth multiline rows={3} value={actionNotes} onChange={(e) => setActionNotes(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAction} color={actionType === 'reject' ? 'error' : 'primary'} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
