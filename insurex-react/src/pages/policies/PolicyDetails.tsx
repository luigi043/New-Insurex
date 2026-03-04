import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Chip, Button, Divider, List, ListItem, ListItemText,
  CircularProgress, Alert, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { Edit, Delete, ArrowBack, Autorenew, Cancel, PlayArrow, Pause, History, Description, Info } from '@mui/icons-material';
import { Policy, PolicyStatus } from '../../types/policy.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { usePolicies } from '../../hooks/usePolicies';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { PolicyHistoryTimeline } from '../../components/Policies/PolicyHistoryTimeline';
import { PolicyRenewalModal } from '../../components/Policies/PolicyRenewalModal';
import { PolicyDocumentViewer } from '../../components/Policies/PolicyDocumentViewer';
import { Tab, Tabs } from '@mui/material';

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
      aria-labelledby={`policy-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const PolicyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const {
    getPolicy,
    deletePolicy,
    cancelPolicy,
    approvePolicy,
    suspendPolicy,
    isLoading,
    error: hookError
  } = usePolicies({ autoFetch: false });

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (id) fetchPolicyData(id);
  }, [id]);

  const fetchPolicyData = async (policyId: string) => {
    setLocalLoading(true);
    try {
      const data = await getPolicy(policyId);
      setPolicy(data);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to fetch policy details');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePolicy(id);
      showNotification('success', 'Policy deleted successfully');
      navigate('/policies');
    } catch (err: any) {
      showNotification('error', err.message || 'Error deleting policy');
    }
  };

  const handleCancelAction = async () => {
    if (!id) return;
    try {
      await cancelPolicy(id, cancelReason);
      showNotification('success', 'Policy cancelled successfully');
      setCancelDialogOpen(false);
      fetchPolicyData(id);
    } catch (err: any) {
      showNotification('error', err.message || 'Error cancelling policy');
    }
  };

  const handleApproveAction = async () => {
    if (!id) return;
    try {
      await approvePolicy(id);
      showNotification('success', 'Policy approved successfully');
      fetchPolicyData(id);
    } catch (err: any) {
      showNotification('error', err.message || 'Error approving policy');
    }
  };

  const handleSuspendAction = async () => {
    if (!id) return;
    try {
      await suspendPolicy(id, 'Suspended by user');
      showNotification('success', 'Policy suspended successfully');
      fetchPolicyData(id);
    } catch (err: any) {
      showNotification('error', err.message || 'Error suspending policy');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: PolicyStatus) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'PENDING':
      case 'DRAFT': return 'warning';
      case 'EXPIRED':
      case 'CANCELLED': return 'error';
      case 'SUSPENDED': return 'default';
      default: return 'default';
    }
  };

  if (localLoading || isLoading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>);
  if (localError || hookError || !policy) return (<Alert severity="error" sx={{ mb: 2 }}>{localError || hookError || 'Policy not found'}</Alert>);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/policies')}>Back</Button>
          <Typography variant="h4">Policy Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {(policy.status.toUpperCase() === 'PENDING' || policy.status.toUpperCase() === 'DRAFT') && (
            <Button variant="contained" color="success" startIcon={<PlayArrow />} onClick={handleApproveAction}>Approve</Button>
          )}
          {policy.status.toUpperCase() === 'ACTIVE' && (
            <Button variant="outlined" color="warning" startIcon={<Pause />} onClick={handleSuspendAction}>Suspend</Button>
          )}
          {(policy.status.toUpperCase() === 'ACTIVE' || policy.status.toUpperCase() === 'SUSPENDED') && (
            <Button variant="outlined" startIcon={<Autorenew />} onClick={() => setRenewDialogOpen(true)}>Renew</Button>
          )}
          {['ACTIVE', 'SUSPENDED', 'PENDING'].includes(policy.status.toUpperCase()) && (
            <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => setCancelDialogOpen(true)}>Cancel</Button>
          )}
          <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/policies/edit/${id}`)}>Edit</Button>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Info />} label="Information" />
          <Tab icon={<Description />} label="Documents" />
          <Tab icon={<History />} label="History" />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h5" gutterBottom>{policy.policyNumber}</Typography>
                  <Chip label={policy.status.toUpperCase()} color={getStatusColor(policy.status)} />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Policy Type</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{policy.type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Policy Holder</Typography>
                  <Typography variant="body1">{policy.holderName}</Typography>
                  <Typography variant="body2" color="textSecondary">{policy.holderEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Start Date</Typography>
                  <Typography variant="body1">{formatDate(policy.startDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">End Date</Typography>
                  <Typography variant="body1">{formatDate(policy.endDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Premium</Typography>
                  <Typography variant="body1">{formatCurrency(policy.premium)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Insured Amount</Typography>
                  <Typography variant="body1">{formatCurrency(policy.insuredAmount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Deductible</Typography>
                  <Typography variant="body1">{formatCurrency(policy.deductible || 0)}</Typography>
                </Grid>
              </Grid>
              {policy.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>Notes</Typography>
                  <Typography variant="body1">{policy.notes}</Typography>
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <List dense>
                  <ListItem><ListItemText primary="Total Premium" secondary={formatCurrency(policy.premium)} /></ListItem>
                  <ListItem><ListItemText primary="Total Coverage" secondary={formatCurrency(policy.insuredAmount)} /></ListItem>
                  <ListItem><ListItemText primary="Created On" secondary={formatDate(policy.createdAt)} /></ListItem>
                  <ListItem><ListItemText primary="Last Updated" secondary={formatDate(policy.updatedAt)} /></ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Paper sx={{ p: 3 }}>
          <PolicyDocumentViewer
            policy={policy}
            onUpload={() => showNotification('info', 'Upload functionality coming soon')}
            onDelete={(docId) => showNotification('success', `Document ${docId} deleted`)}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Activity History</Typography>
          <PolicyHistoryTimeline policyId={policy.id} />
        </Paper>
      </TabPanel>

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
          <Button onClick={() => setCancelDialogOpen(false)}>Close</Button>
          <Button onClick={handleCancelAction} color="error" variant="contained">Confirm Cancellation</Button>
        </DialogActions>
      </Dialog>

      {renewDialogOpen && (
        <PolicyRenewalModal
          open={renewDialogOpen}
          onClose={() => setRenewDialogOpen(false)}
          policy={policy}
          onSuccess={() => {
            showNotification('success', 'Policy renewed successfully');
            fetchPolicyData(policy.id);
          }}
        />
      )}
    </Box>
  );
};

export default PolicyDetails;
