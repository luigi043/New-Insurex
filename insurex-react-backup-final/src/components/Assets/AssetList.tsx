import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { assetService } from '../../services/asset.service';

export const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [assetType, setAssetType] = useState('');

  const assetTypes = assetService.getAssetTypes();

  useEffect(() => {
    loadAssets();
  }, [page, pageSize, assetType]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await assetService.getAssets(page + 1, pageSize, assetType);
      setAssets(response.data.items);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'UnderMaintenance': return 'warning';
      case 'Disposed': return 'error';
      case 'Claimed': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Assets</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/assets/new')}
        >
          New Asset
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Asset Type</InputLabel>
              <Select
                value={assetType}
                label="Asset Type"
                onChange={(e) => setAssetType(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {assetTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Acquisition Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No assets found</TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>${asset.value?.toLocaleString()}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={asset.status}
                      color={getStatusColor(asset.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(asset.acquisitionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/assets/${asset.id}`)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/assets/edit/${asset.id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};