import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  FileDownload,
  AttachFile,
  Renew,
  Cancel,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import { policyService } from '../../services/policy.service';
import { Policy, PolicyStatus } from '../../types/policy.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';

export const PolicyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  useEffect(() => {
    if (id) {
      fetchPolicy(id);
    }
  }, [id]);

  const fetchPolicy = async (policyId: string) => {
    setIsLoading(true);
    try {
      const data = await policyService.getPolicy(policyId);
      setPolicy(data);
      setNewEndDate(data.endDate);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch policy details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await policyService.deletePolicy(id);
      showSuccess('Policy deleted successfully');
      navigate('/policies');
    } catch (err: any) {
      showError(err.message || 'Failed to delete policy');
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    try {
      await policyService.cancelPolicy(id, {
        reason: cancelReason,
        cancellationDate: new Date().toISOString(),
      });
      showSuccess('Policy cancelled successfully');
      setCancelDialogOpen(false);
      fetchPolicy(id);
    } catch (err: any) {
      showError(err.message || 'Failed to cancel policy');
    }
  };

  const handleRenew = async () => {
    if (!id) return;
    try {
      await policyService.renewPolicy(id, {
        newEndDate,
      });
      showSuccess('Policy renewed successfully');
      setRenewDialogOpen(false);
      fetchPolicy(id);
    } catch (err: any) {
      showError(err.message || 'Failed to renew policy');
    }
  };

  const handleActivate = async () => {
    if (!id) return;
    try {
      await policyService.activatePolicy(id);
      showSuccess('Policy activated successfully');
      fetchPolicy(id);
    } catch (err: any) {
      showError(err.message || 'Failed to activate policy');
    }
  };

  const handleSuspend = async () => {
    if (!id) return;
    try {
      await policyService.suspendPolicy(id, 'Suspended by user');
      showSuccess('Policy suspended successfully');
      fetchPolicy(id);
    } catch (err: any) {
      showError(err.message || 'Failed to suspend policy');
    }
  };

  const getStatusColor = (status: PolicyStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
      case 'cancelled':
        return 'error';
      case 'suspended':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !policy) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Policy not found'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/policies')}
          >
            Back
          </Button>
          <Typography variant="h4">Policy Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {policy.status === 'pending' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<PlayArrow />}
              onClick={handleActivate}
            >
              Activate
            </Button>
          )}
          {policy.status === 'active' && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Pause />}
              onClick={handleSuspend}
            >
              Suspend
            </Button>
          )}
          {(policy.status === 'active' || policy.status === 'suspended') && (
            <Button
              variant="outlined"
              startIcon={<Renew />}
              onClick={() => setRenewDialogOpen(true)}
            >
              Renew
            </Button>
          )}
          {(policy.status === 'active' || policy.status === 'suspended' || policy.status === 'pending') && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/policies/edit/${id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {policy.policyNumber}
                </Typography>
                <Chip
                  label={policy.status.toUpperCase()}
                  color={getStatusColor(policy.status)}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Policy Type
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {policy.type}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Policy Holder
                </Typography>
                <Typography variant="body1">{policy.holderName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {policy.holderEmail}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Start Date
                </Typography>
                <Typography variant="body1">{formatDate(policy.startDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  End Date
                </Typography>
                <Typography variant="body1">{formatDate(policy.endDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Premium
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(policy.premium, policy.currency)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Coverage Amount
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(policy.coverageAmount, policy.currency)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Deductible
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(policy.deductible, policy.currency)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Frequency
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {policy.paymentFrequency}
                </Typography>
              </Grid>
            </Grid>

            {policy.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{policy.description}</Typography>
              </>
            )}

            {policy.terms && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Terms & Conditions
                </Typography>
                <Typography variant="body1">{policy.terms}</Typography>
              </>
            )}
          </Paper>

          {policy.benefits && policy.benefits.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Benefits
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Coverage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {policy.benefits.map((benefit) => (
                      <TableRow key={benefit.id}>
                        <TableCell>{benefit.name}</TableCell>
                        <TableCell>{benefit.description}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(benefit.coverageAmount, policy.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Total Premium"
                    secondary={formatCurrency(policy.premium, policy.currency)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total Coverage"
                    secondary={formatCurrency(policy.coverageAmount, policy.currency)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Created"
                    secondary={formatDate(policy.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={formatDate(policy.updatedAt)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {policy.documents && policy.documents.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <List dense>
                {policy.documents.map((doc) => (
                  <ListItem
                    key={doc.id}
                    secondaryAction={
                      <Tooltip title="Download">
                        <IconButton edge="end" size="small">
                          <FileDownload />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={doc.name}
                      secondary={formatDate(doc.uploadedAt)}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Policy"
        message="Are you sure you want to delete this policy? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Policy</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cancellation Reason"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={renewDialogOpen} onClose={() => setRenewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Renew Policy</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="New End Date"
            type="date"
            fullWidth
            value={newEndDate}
            onChange={(e) => setNewEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenew} variant="contained">
            Renew Policy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
