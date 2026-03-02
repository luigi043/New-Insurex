import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Tooltip,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  Refresh,
} from '@mui/icons-material';
import { usePolicies } from '../../hooks/usePolicies';
import { PolicyStatus, PolicyType } from '../../types/policy.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const policyStatuses: { value: PolicyStatus | ''; label: string; color: any }[] = [
  { value: '', label: 'All Statuses', color: 'default' },
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'suspended', label: 'Suspended', color: 'error' },
  { value: 'expired', label: 'Expired', color: 'error' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'renewed', label: 'Renewed', color: 'info' },
];

const policyTypes: { value: PolicyType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'life', label: 'Life' },
  { value: 'health', label: 'Health' },
  { value: 'auto', label: 'Auto' },
  { value: 'home', label: 'Home' },
  { value: 'property', label: 'Property' },
  { value: 'liability', label: 'Liability' },
  { value: 'travel', label: 'Travel' },
  { value: 'business', label: 'Business' },
  { value: 'marine', label: 'Marine' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'other', label: 'Other' },
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
    totalItems,
    isLoading,
    error,
    refetch,
    deletePolicy,
  } = usePolicies({
    page: page + 1,
    pageSize,
    filters: {
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      type: typeFilter || undefined,
    },
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleDeleteClick = (id: string) => {
    setPolicyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (policyToDelete) {
      const success = await deletePolicy(policyToDelete);
      if (success) {
        showSuccess('Policy deleted successfully');
      } else {
        showError('Failed to delete policy');
      }
    }
    setDeleteDialogOpen(false);
    setPolicyToDelete(null);
  };

  const getStatusColor = (status: PolicyStatus) => {
    const statusConfig = policyStatuses.find((s) => s.value === status);
    return statusConfig?.color || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Policies</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/policies/new')}
        >
          New Policy
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search policies..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PolicyStatus | '')}
            >
              {policyStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PolicyType | '')}
            >
              {policyTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={() => refetch()}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear Filters">
                <IconButton
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('');
                    setTypeFilter('');
                  }}
                >
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No policies found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                policies.map((policy) => (
                  <TableRow key={policy.id} hover>
                    <TableCell>{policy.policyNumber}</TableCell>
                    <TableCell>
                      {policyTypes.find((t) => t.value === policy.type)?.label || policy.type}
                    </TableCell>
                    <TableCell>{policy.holderName}</TableCell>
                    <TableCell>
                      <Chip
                        label={policyStatuses.find((s) => s.value === policy.status)?.label || policy.status}
                        color={getStatusColor(policy.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(policy.startDate)}</TableCell>
                    <TableCell>{formatDate(policy.endDate)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(policy.premium, policy.currency)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/policies/${policy.id}`)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/policies/edit/${policy.id}`)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(policy.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Policy"
        message="Are you sure you want to delete this policy? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setPolicyToDelete(null);
        }}
      />
    </Box>
  );
};
