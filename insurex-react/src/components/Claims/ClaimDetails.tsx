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
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  AttachFile,
} from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import { Claim, ClaimStatus, ClaimDocument } from '../../types/claim.types';
import { useNotification } from '../../hooks/useNotification';

export const ClaimDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ClaimStatus | ''>('');
  const [statusReason, setStatusReason] = useState('');
  const [documents, setDocuments] = useState<ClaimDocument[]>([]);

  const statusSteps = [
    'Submitted',
    'Under Review',
    'Approved',
    'Paid',
    'Closed'
  ];

  const getActiveStep = () => {
    if (!claim) return 0;
    const statusMap: Record<string, number> = {
      [ClaimStatus.SUBMITTED]: 0,
      [ClaimStatus.UNDER_REVIEW]: 1,
      [ClaimStatus.APPROVED]: 2,
      [ClaimStatus.SETTLED]: 3,
      [ClaimStatus.CLOSED]: 4,
      [ClaimStatus.REJECTED]: 1,
      [ClaimStatus.PENDING_INFO]: 1
    };
    return statusMap[claim.status] || 0;
  };

  useEffect(() => {
    if (id) {
      loadClaim();
      loadDocuments();
    }
  }, [id]);

  const loadClaim = async () => {
    try {
      const data = await claimService.getClaim(id!);
      setClaim(data);
    } catch (error) {
      console.error('Failed to load claim:', error);
      showError('Failed to load claim details');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await claimService.getDocuments(id!);
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await claimService.updateClaimStatus(id!, newStatus as ClaimStatus, statusReason);
      showSuccess('Claim status updated successfully');
      setStatusDialog(false);
      loadClaim();
    } catch (error) {
      console.error('Failed to update status:', error);
      showError('Failed to update claim status');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await claimService.uploadDocument(id!, file, file.name);
        showSuccess('Document uploaded successfully');
        loadDocuments();
      } catch (error) {
        console.error('Failed to upload document:', error);
        showError('Failed to upload document');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!claim) {
    return (
      <Box p={3}>
        <Alert severity="error">Claim not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/claims')} sx={{ mt: 2 }}>
          Back to Claims
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/claims')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Claim {claim.claimNumber}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/claims/edit/${id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this claim?')) {
                claimService.delete(id!).then(() => {
                  showSuccess('Claim deleted');
                  navigate('/claims');
                });
              }
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Status Timeline */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Claim Progress</Typography>
            <Stepper activeStep={getActiveStep()} alternativeLabel>
              {statusSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setNewStatus(claim.status);
                  setStatusDialog(true);
                }}
              >
                Update Status
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Claim Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Claim Information</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">Claim Number</Typography>
                <Typography variant="body1" gutterBottom fontWeight="medium">{claim.claimNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">Type</Typography>
                <Typography variant="body1" gutterBottom>{claim.type}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">Description</Typography>
                <Typography variant="body1" gutterBottom>{claim.description}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">Incident Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(claim.incidentDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">Reported Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(claim.reportedDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="textSecondary">Claimed Amount</Typography>
                <Typography variant="body1" gutterBottom color="primary.main" fontWeight="bold">
                  ${claim.claimedAmount?.toLocaleString()}
                </Typography>
              </Grid>
              {claim.approvedAmount !== undefined && (
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="textSecondary">Approved Amount</Typography>
                  <Typography variant="body1" gutterBottom color="success.main" fontWeight="bold">
                    ${claim.approvedAmount?.toLocaleString()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Status & Policy Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <Divider sx={{ mb: 2 }} />

            <Box mb={2}>
              <Typography variant="caption" color="textSecondary" display="block">Current Status</Typography>
              <Chip
                label={claim.status}
                color={claim.status === ClaimStatus.APPROVED || claim.status === ClaimStatus.SETTLED ? 'success' : 'primary'}
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="caption" color="textSecondary" display="block">Policy Number</Typography>
              <Typography variant="body1">{claim.policyNumber}</Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="caption" color="textSecondary" display="block">Claimant</Typography>
              <Typography variant="body1">{claim.holderName}</Typography>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate(`/policies/${claim.policyId}`)}
            >
              View Policy
            </Button>
          </Paper>
        </Grid>

        {/* Documents */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Documents</Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<AttachFile />}
                size="small"
              >
                Upload Document
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {documents.length === 0 ? (
              <Typography color="textSecondary" variant="body2" sx={{ fontStyle: 'italic', py: 2 }}>
                No documents uploaded for this claim.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {documents.map((doc) => (
                  <Grid item xs={12} sm={6} md={4} key={doc.id}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: '200px' }}>
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <IconButton size="small" color="error" onClick={() => {
                          if (window.confirm('Delete document?')) {
                            claimService.deleteDocument(id!, doc.id).then(() => {
                              showSuccess('Document deleted');
                              loadDocuments();
                            });
                          }
                        }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Claim Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value as ClaimStatus)}
              >
                <MenuItem value={ClaimStatus.UNDER_REVIEW}>Under Review</MenuItem>
                <MenuItem value={ClaimStatus.APPROVED}>Approved</MenuItem>
                <MenuItem value={ClaimStatus.REJECTED}>Rejected</MenuItem>
                <MenuItem value={ClaimStatus.SETTLED}>Settled</MenuItem>
                <MenuItem value={ClaimStatus.CLOSED}>Closed</MenuItem>
                <MenuItem value={ClaimStatus.PENDING_INFO}>Need Info</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes / Reason"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" disabled={!newStatus}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClaimDetails;