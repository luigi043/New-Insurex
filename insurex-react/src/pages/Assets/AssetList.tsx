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
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { assetService } from '../services/asset.service';
import { AssetType, AssetStatus } from '../types/asset.types';

export const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('');

  useEffect(() => {
    loadAssets();
  }, [typeFilter]);

  const loadAssets = async () => {
    const response = await assetService.getAssets(1, 10, typeFilter || undefined);
    setAssets(response.data.items);
    setLoading(false);
  };

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'UnderMaintenance': return 'warning';
      case 'Disposed': return 'error';
      case 'Claimed': return 'info';
      default: return 'default';
    }
  };

  const stats = {
    total: assets.length,
    totalValue: assets.reduce((sum, a) => sum + a.value, 0),
    active: assets.filter(a => a.status === 'Active').length,
    byType: Object.values(AssetType).map(type => ({
      type,
      count: assets.filter(a => a.type === type).length
    }))
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Assets Management</Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Assets</Typography>
              <Typography variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Total Value</Typography>
              <Typography variant="h5">${stats.totalValue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Active Assets</Typography>
              <Typography variant="h5" color="success.main">{stats.active}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Asset Types</Typography>
              <Typography variant="h5">{Object.keys(AssetType).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Asset Type</InputLabel>
              <Select
                value={typeFilter}
                label="Asset Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.values(AssetType).map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Actions */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
        >
          New Asset
        </Button>
      </Box>

      {/* Assets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Policy</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>${asset.value.toLocaleString()}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>POL-{asset.policyId}</TableCell>
                <TableCell>
                  <Chip
                    label={asset.status}
                    color={getStatusColor(asset.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
