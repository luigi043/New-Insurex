import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Chip, TextField, MenuItem,
  Grid, Tooltip, CircularProgress, Alert, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Search, Refresh } from '@mui/icons-material';
import { useClaims } from '../../hooks/useClaims';
import { ClaimStatus, ClaimType } from '../../types/claim.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const claimStatuses: { value: ClaimStatus | ''; label: string; color: any }[] = [
  { value: '', label: 'All Statuses', color: 'default' },
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'submitted', label: 'Submitted', color: 'info' },
  { value: 'under_review', label: 'Under Review', color: 'warning' },
  { value: 'pending_info', label: 'Pending Info', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'partially_approved', label: 'Partially Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'in_payment', label: 'In Payment', color: 'info' },
  { value: 'settled', label: 'Settled', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

const claimTypes: { value: ClaimType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'property_damage', label: 'Property Damage' },
  { value: 'theft', label: 'Theft' },
  { value: 'liability', label: 'Liability' },
  { value: 'bodily_injury', label: 'Bodily Injury' },
  { value: 'medical', label: 'Medical' },
  { value: 'collision', label: 'Collision' },
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'fire', label: 'Fire' },
  { value: 'flood', label: 'Flood' },
  { value: 'natural_disaster', label: 'Natural Disaster' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'other', label: 'Other' },
];

export const ClaimList: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<ClaimType | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState<string | null>(null);

  const { claims, totalItems, isLoading, error, refetch, deleteClaim } = useClaims({
    page: page + 1, pageSize,
    filters: { search: searchQuery || undefined, status: statusFilter || undefined, type: typeFilter || undefined },
  });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  const handleDeleteClick = (id: string) => { setClaimToDelete(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = async () => {
    if (claimToDelete) {
      const success = await deleteClaim(claimToDelete);
      success ? showSuccess('Claim deleted successfully') : showError('Failed to delete claim');
    }
    setDeleteDialogOpen(false);
    setClaimToDelete(null);
  };
  const getStatusColor = (status: ClaimStatus) => claimStatuses.find((s) => s.value === status)?.color || 'default';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Claims</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/claims/new')}>New Claim</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField fullWidth placeholder="Search claims..." value={searchQuery} onChange={handleSearch}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | '')}>
              {claimStatuses.map((status) => (<MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as ClaimType | '')}>
              {claimTypes.map((type) => (<MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Tooltip title="Refresh"><IconButton onClick={() => refetch()}><Refresh /></IconButton></Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Claim Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Claimant</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Incident Date</TableCell>
                <TableCell align="right">Estimated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (<TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>) :
               claims.length === 0 ? (<TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="textSecondary">No claims found</Typography></TableCell></TableRow>) :
               (claims.map((claim) => (
                <TableRow key={claim.id} hover>
                  <TableCell>{claim.claimNumber}</TableCell>
                  <TableCell>{claimTypes.find((t) => t.value === claim.type)?.label || claim.type}</TableCell>
                  <TableCell>{claim.claimantName}</TableCell>
                  <TableCell><Chip label={claimStatuses.find((s) => s.value === claim.status)?.label || claim.status} color={getStatusColor(claim.status)} size="small" /></TableCell>
                  <TableCell>{formatDate(claim.incidentDate)}</TableCell>
                  <TableCell align="right">{formatCurrency(claim.estimatedAmount, claim.currency)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/claims/${claim.id}`)}><Visibility /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/claims/edit/${claim.id}`)}><Edit /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteClick(claim.id)}><Delete /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={totalItems} page={page} onPageChange={handleChangePage}
          rowsPerPage={pageSize} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
      </Paper>

      <ConfirmDialog open={deleteDialogOpen} title="Delete Claim" message="Are you sure you want to delete this claim? This action cannot be undone."
        onConfirm={handleConfirmDelete} onCancel={() => { setDeleteDialogOpen(false); setClaimToDelete(null); }} />
    </Box>
  );
};
