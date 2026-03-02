import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Chip, TextField, MenuItem,
  Grid, Tooltip, CircularProgress, Alert, InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Search, Refresh } from '@mui/icons-material';
import { useAssets } from '../../hooks/useAssets';
import { AssetStatus, AssetType } from '../../types/asset.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const assetStatuses: { value: AssetStatus | ''; label: string; color: any }[] = [
  { value: '', label: 'All Statuses', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'default' },
  { value: 'sold', label: 'Sold', color: 'info' },
  { value: 'disposed', label: 'Disposed', color: 'error' },
  { value: 'under_maintenance', label: 'Maintenance', color: 'warning' },
];

const assetTypes: { value: AssetType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'property', label: 'Property' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'art', label: 'Art' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'livestock', label: 'Livestock' },
  { value: 'crop', label: 'Crop' },
  { value: 'vessel', label: 'Vessel' },
  { value: 'aircraft', label: 'Aircraft' },
  { value: 'other', label: 'Other' },
];

export const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<AssetType | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const { assets, totalItems, isLoading, error, refetch, deleteAsset } = useAssets({
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
  const handleDeleteClick = (id: string) => { setAssetToDelete(id); setDeleteDialogOpen(true); };
  const handleConfirmDelete = async () => {
    if (assetToDelete) {
      const success = await deleteAsset(assetToDelete);
      success ? showSuccess('Asset deleted successfully') : showError('Failed to delete asset');
    }
    setDeleteDialogOpen(false);
    setAssetToDelete(null);
  };
  const getStatusColor = (status: AssetStatus) => assetStatuses.find((s) => s.value === status)?.color || 'default';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Assets</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/assets/new')}>New Asset</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField fullWidth placeholder="Search assets..." value={searchQuery} onChange={handleSearch}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as AssetStatus | '')}>
              {assetStatuses.map((status) => (<MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as AssetType | '')}>
              {assetTypes.map((type) => (<MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>))}
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
                <TableCell>Asset ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (<TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>) :
               assets.length === 0 ? (<TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="textSecondary">No assets found</Typography></TableCell></TableRow>) :
               (assets.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>{asset.assetId}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{assetTypes.find((t) => t.value === asset.type)?.label || asset.type}</TableCell>
                  <TableCell><Chip label={assetStatuses.find((s) => s.value === asset.status)?.label || asset.status} color={getStatusColor(asset.status)} size="small" /></TableCell>
                  <TableCell>{asset.ownerName}</TableCell>
                  <TableCell align="right">{formatCurrency(asset.value, asset.currency)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/assets/${asset.id}`)}><Visibility /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/assets/edit/${asset.id}`)}><Edit /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteClick(asset.id)}><Delete /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={totalItems} page={page} onPageChange={handleChangePage}
          rowsPerPage={pageSize} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
      </Paper>

      <ConfirmDialog open={deleteDialogOpen} title="Delete Asset" message="Are you sure you want to delete this asset? This action cannot be undone."
        onConfirm={handleConfirmDelete} onCancel={() => { setDeleteDialogOpen(false); setAssetToDelete(null); }} />
    </Box>
  );
};

export default AssetList;
