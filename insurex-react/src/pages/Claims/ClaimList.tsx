import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Add, Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { claimService } from '../services/claim.service';
import { ClaimStatus, ClaimType } from '../types/claim.types';

export const ClaimList: React.FC = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openProcessDialog, setOpenProcessDialog] = useState(false);
  const [processData, setProcessData] = useState({ approvedAmount: 0, rejectionReason: '' });

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    const response = await claimService.getClaims();
    setClaims(response.data.items);
    setLoading(false);
  };

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'Submitted': return 'info';
      case 'UnderReview': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Paid': return 'success';
      default: return 'default';
    }
  };

  const handleProcess = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      await claimService.processClaim(id, {
        status: 'Approved',
        approvedAmount: processData.approvedAmount
      });
    } else {
      await claimService.processClaim(id, {
        status: 'Rejected',
        rejectionReason: processData.rejectionReason
      });
    }
    setOpenProcessDialog(false);
    loadClaims();
  };

  const stats = {
    total: claims.length,
    submitted: claims.filter(c => c.status === 'Submitted').length,
    approved: claims.filter(c => c.status === 'Approved').length,
    totalAmount: claims.reduce((sum, c) => sum + c.claimedAmount, 0)
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Claims Management</Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Claims</Typography>
              <Typography variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Submitted</Typography>
              <Typography variant="h5" color="info.main">{stats.submitted}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Approved</Typography>
              <Typography variant="h5" color="success.main">{stats.approved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Amount</Typography>
              <Typography variant="h5">${stats.totalAmount.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          New Claim
        </Button>
      </Box>

      {/* Claims Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Claim #</TableCell>
              <TableCell>Policy</TableCell>
              <TableCell>Incident Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell>{claim.claimNumber}</TableCell>
                <TableCell>POL-{claim.policyId}</TableCell>
                <TableCell>{new Date(claim.incidentDate).toLocaleDateString()}</TableCell>
                <TableCell>{claim.type}</TableCell>
                <TableCell>${claim.claimedAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={claim.status}
                    color={getStatusColor(claim.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => {
                    setSelectedClaim(claim);
                    setOpenDialog(true);
                  }}>
                    <Visibility />
                  </IconButton>
                  {claim.status === 'Submitted' && (
                    <>
                      <IconButton size="small" color="success" onClick={() => {
                        setSelectedClaim(claim);
                        setOpenProcessDialog(true);
                      }}>
                        <CheckCircle />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => {
                        setSelectedClaim(claim);
                        setOpenProcessDialog(true);
                      }}>
                        <Cancel />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New/Edit Claim Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedClaim ? 'View Claim' : 'New Claim'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Policy ID"
                defaultValue={selectedClaim?.policyId}
                disabled={!!selectedClaim}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Claim Type"
                defaultValue={selectedClaim?.type || 'VehicleAccident'}
                disabled={!!selectedClaim}
              >
                {Object.values(ClaimType).map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Incident Date"
                defaultValue={selectedClaim?.incidentDate || new Date().toISOString().split('T')[0]}
                InputLabelProps={{ shrink: true }}
                disabled={!!selectedClaim}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Claimed Amount"
                defaultValue={selectedClaim?.claimedAmount}
                disabled={!!selectedClaim}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                defaultValue={selectedClaim?.description}
                disabled={!!selectedClaim}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {!selectedClaim && (
            <Button variant="contained">Submit Claim</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Process Claim Dialog */}
      <Dialog open={openProcessDialog} onClose={() => setOpenProcessDialog(false)}>
        <DialogTitle>Process Claim</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Approved Amount"
              value={processData.approvedAmount}
              onChange={(e) => setProcessData({ ...processData, approvedAmount: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Rejection Reason (if rejecting)"
              value={processData.rejectionReason}
              onChange={(e) => setProcessData({ ...processData, rejectionReason: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProcessDialog(false)}>Cancel</Button>
          <Button color="success" onClick={() => handleProcess(selectedClaim?.id, 'approve')}>
            Approve
          </Button>
          <Button color="error" onClick={() => handleProcess(selectedClaim?.id, 'reject')}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
