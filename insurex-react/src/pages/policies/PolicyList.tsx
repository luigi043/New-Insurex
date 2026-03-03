import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Chip, TextField, MenuItem,
  Grid, Tooltip, CircularProgress, Alert, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Search, Refresh } from '@mui/icons-material';
import { usePolicies } from '../../hooks/usePolicies';
import { PolicyStatus, PolicyType } from '../../types/policy.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const policyStatuses: { value: PolicyStatus | ''; label: string; color: any }[] = [
  { value: '', label: 'All Statuses', color: 'default' },
  { value: PolicyStatus.DRAFT, label: 'Draft', color: 'default' },
  { value: PolicyStatus.PENDING, label: 'Pending', color: 'warning' },
  { value: PolicyStatus.ACTIVE, label: 'Active', color: 'success' },
  { value: PolicyStatus.SUSPENDED, label: 'Suspended', color: 'error' },
  { value: PolicyStatus.EXPIRED, label: 'Expired', color: 'error' },
  { value: PolicyStatus.CANCELLED, label: 'Cancelled', color: 'error' },
];

const policyTypes: { value: PolicyType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: PolicyType.LIFE, label: 'Life' },
  { value: PolicyType.HEALTH, label: 'Health' },
  { value: PolicyType.AUTO, label: 'Auto' },
  { value: PolicyType.HOME, label: 'Home' },
  { value: PolicyType.PROPERTY, label: 'Property' },
  { value: PolicyType.LIABILITY, label: 'Liability' },
  { value: PolicyType.TRAVEL, label: 'Travel' },
  { value: PolicyType.BUSINESS, label: 'Business' },
];

export const PolicyList: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<PolicyType | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);

  const {
    policies,
    pagination,
    isLoading,
    error,
    fetchPolicies,
    deletePolicy,
  } = usePolicies({
    page: page + 1,
    limit: pageSize,
    filters: {
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      type: typeFilter || undefined,
    },
  });

  const totalItems = pagination.total;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    fetchPolicies(newPage + 1, pageSize);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(0);
    fetchPolicies(1, newSize);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleDeleteClick = (id: string) => { setPolicyToDelete(id); setDeleteDialogOpen(true); };

  const handleConfirmDelete = async () => {
    if (policyToDelete) {
      try {
        await deletePolicy(policyToDelete);
        showSuccess('Policy deleted successfully');
      } catch (err) {
        showError('Failed to delete policy');
      }
    }
    setDeleteDialogOpen(false);
    setPolicyToDelete(null);
  };

  const getStatusColor = (status: PolicyStatus) => policyStatuses.find((s) => s.value === status)?.color || 'default';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Policies</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/policies/new')}>New Policy</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField fullWidth placeholder="Search policies..." value={searchQuery} onChange={handleSearch}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as PolicyStatus | '')}>
              {policyStatuses.map((status) => (<MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as PolicyType | '')}>
              {policyTypes.map((type) => (<MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Tooltip title="Refresh"><IconButton onClick={() => fetchPolicies()}><Refresh /></IconButton></Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Policy Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Holder</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell align="right">Premium</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (<TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>) :
                policies.length === 0 ? (<TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><Typography color="textSecondary">No policies found</Typography></TableCell></TableRow>) :
                  (policies.map((policy) => (
                    <TableRow key={policy.id} hover>
                      <TableCell>{policy.policyNumber}</TableCell>
                      <TableCell>{policyTypes.find((t) => t.value === policy.type)?.label || policy.type}</TableCell>
                      <TableCell>{policy.holderName}</TableCell>
                      <TableCell><Chip label={policyStatuses.find((s) => s.value === policy.status)?.label || policy.status} color={getStatusColor(policy.status)} size="small" /></TableCell>
                      <TableCell>{formatDate(policy.startDate)}</TableCell>
                      <TableCell>{formatDate(policy.endDate)}</TableCell>
                      <TableCell align="right">{formatCurrency(policy.premium, 'BRL')}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/policies/${policy.id}`)}><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/policies/edit/${policy.id}`)}><Edit /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteClick(policy.id)}><Delete /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  )))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={totalItems} page={page} onPageChange={handleChangePage}
          rowsPerPage={pageSize} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
      </Paper>

      <ConfirmDialog open={deleteDialogOpen} title="Delete Policy" message="Are you sure you want to delete this policy? This action cannot be undone."
        onConfirm={handleConfirmDelete} onCancel={() => { setDeleteDialogOpen(false); setPolicyToDelete(null); }} />
    </Box>
  );
};

export default PolicyList;
