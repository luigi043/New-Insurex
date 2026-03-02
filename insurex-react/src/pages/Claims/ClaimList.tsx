import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, Card, CardContent } from '@mui/material';
import { Add, CheckCircle, Cancel } from '@mui/icons-material';
import { claimService } from '../services/claim.service';
import { ClaimStatus, ClaimType } from '../types/claim.types';

export const ClaimList: React.FC = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [processData, setProcessData] = useState({ approvedAmount: 0, rejectionReason: '' });

  useEffect(() => { loadClaims(); }, []);

  const loadClaims = async () => {
    const data = await claimService.getClaims();
    setClaims(data.items);
  };

  const handleProcess = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') await claimService.processClaim(id, { status: 'Approved', approvedAmount: processData.approvedAmount });
    else await claimService.processClaim(id, { status: 'Rejected', rejectionReason: processData.rejectionReason });
    setOpenDialog(false);
    loadClaims();
  };

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'Submitted').length,
    approved: claims.filter(c => c.status === 'Approved').length
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Claims</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}><Card><CardContent><Typography color="textSecondary">Total</Typography><Typography variant="h5">{stats.total}</Typography></CardContent></Card></Grid>
        <Grid item xs={4}><Card><CardContent><Typography color="textSecondary">Pending</Typography><Typography variant="h5" color="warning.main">{stats.pending}</Typography></CardContent></Card></Grid>
        <Grid item xs={4}><Card><CardContent><Typography color="textSecondary">Approved</Typography><Typography variant="h5" color="success.main">{stats.approved}</Typography></CardContent></Card></Grid>
      </Grid>
      <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>New Claim</Button>
      <TableContainer component={Paper}>
        <Table><TableHead><TableRow><TableCell>Claim #</TableCell><TableCell>Type</TableCell><TableCell>Amount</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
        <TableBody>{claims.map(c => (
          <TableRow key={c.id}>
            <TableCell>{c.claimNumber}</TableCell><TableCell>{c.type}</TableCell><TableCell>${c.claimedAmount}</TableCell>
            <TableCell><Chip label={c.status} color={c.status === 'Approved' ? 'success' : c.status === 'Rejected' ? 'error' : 'warning'} size="small" /></TableCell>
            <TableCell>
              {c.status === 'Submitted' && (<><IconButton size="small" color="success" onClick={() => { setSelectedClaim(c); setOpenDialog(true); }}><CheckCircle /></IconButton>
              <IconButton size="small" color="error" onClick={() => { setSelectedClaim(c); setOpenDialog(true); }}><Cancel /></IconButton></>)}
            </TableCell>
          </TableRow>
        ))}</TableBody></Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Process Claim</DialogTitle>
        <DialogContent>
          <TextField fullWidth type="number" label="Approved Amount" value={processData.approvedAmount} onChange={(e) => setProcessData({...processData, approvedAmount: Number(e.target.value)})} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth multiline rows={3} label="Rejection Reason" value={processData.rejectionReason} onChange={(e) => setProcessData({...processData, rejectionReason: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="success" onClick={() => handleProcess(selectedClaim?.id, 'approve')}>Approve</Button>
          <Button color="error" onClick={() => handleProcess(selectedClaim?.id, 'reject')}>Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
