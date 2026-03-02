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
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  AttachFile,
} from '@mui/icons-material';
import { claimService } from '../../services/claim.service';

export const ClaimDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);

  const statusSteps = [
    'Submitted',
    'Under Review',
    'Approved',
    'Paid',
    'Closed'
  ];

  const getActiveStep = () => {
    const statusMap: any = {
      'Submitted': 0,
      'UnderReview': 1,
      'Approved': 2,
      'Paid': 3,
      'Closed': 4,
      'Rejected': 1,
      'AdditionalInfoRequired': 1
    };
    return statusMap[claim?.status] || 0;
  };

  useEffect(() => {
    loadClaim();
    loadDocuments();
  }, [id]);

  const loadClaim = async () => {
    try {
      const response = await claimService.getClaim(id!);
      setClaim(response.data);
    } catch (error) {
      console.error('Failed to load claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await claimService.getDocuments(id!);
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await claimService.updateClaimStatus(id!, newStatus, statusReason);
      setStatusDialog(false);
      loadClaim();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await claimService.uploadDocument(id!, file);
        loadDocuments();
      } catch (error) {
        console.error('Failed to upload document:', error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!claim) {
    return <Typography>Claim not found</Typography>;
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
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/claims/edit/${id}`)}
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
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setStatusDialog(true)}
              >
                Update Status
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Claim Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Claim Information</Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Claim Number</Typography>
                <Typography variant="body1" gutterBottom>{claim.claimNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Type</Typography>
                <Typography variant="body1" gutterBottom>{claim.type}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">Description</Typography>
                <Typography variant="body1" gutterBottom>{claim.description}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Incident Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(claim.incidentDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Reported Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(claim.reportedDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Claimed Amount</Typography>
                <Typography variant="body1" gutterBottom>
                  ${claim.claimedAmount?.toLocaleString()}
                </Typography>
              </Grid>
              {claim.approvedAmount && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">Approved Amount</Typography>
                  <Typography variant="body1" gutterBottom>
                    ${claim.approvedAmount?.toLocaleString()}
                  </Typography>
                </Grid>
              )}
              {claim.paymentReference && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Payment Reference</Typography>
                  <Typography variant="body1" gutterBottom>{claim.paymentReference}</Typography>
                </Grid>
              )}
              {claim.rejectionReason && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">Rejection Reason</Typography>
                  <Typography variant="body1" gutterBottom color="error">
                    {claim.rejectionReason}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Policy Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Policy Information</Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="textSecondary">Policy Number</Typography>
            <Typography variant="body1" gutterBottom>
              {claim.policy?.policyNumber}
            </Typography>

            <Typography variant="body2" color="textSecondary">Policy Name</Typography>
            <Typography variant="body1" gutterBottom>
              {claim.policy?.name}
            </Typography>

            <Typography variant="body2" color="textSecondary">Client</Typography>
            <Typography variant="body1" gutterBottom>
              {claim.client?.firstName} {claim.client?.lastName}
            </Typography>

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
              <Typography color="textSecondary">No documents uploaded</Typography>
            ) : (
              <Grid container spacing={2}>
                {documents.map((doc) => (
                  <Grid item xs={12} md={6} key={doc.id}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography>{doc.fileName}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </Typography>
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
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="UnderReview">Under Review</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason / Comments"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};