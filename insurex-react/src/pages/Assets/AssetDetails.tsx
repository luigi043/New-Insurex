import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';
import { assetService } from '../../services/asset.service';
import { Asset } from '../../types/asset.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';

export const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAsset(id);
    }
  }, [id]);

  const fetchAsset = async (assetId: string) => {
    setIsLoading(true);
    try {
      const data = await assetService.getAsset(assetId);
      setAsset(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch asset details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await assetService.deleteAsset(id);
      showSuccess('Asset deleted successfully');
      navigate('/assets');
    } catch (err: any) {
      showError(err.message || 'Failed to delete asset');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'sold':
        return 'info';
      case 'disposed':
        return 'error';
      case 'under_maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !asset) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Asset not found'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/assets')}>
            Back
          </Button>
          <Typography variant="h4">Asset Details</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/assets/edit/${id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {asset.name}
                </Typography>
                <Chip label={asset.assetId} variant="outlined" sx={{ mr: 1 }} />
                <Chip
                  label={asset.status.toUpperCase()}
                  color={getStatusColor(asset.status)}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Asset Type
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {asset.type}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Owner
                </Typography>
                <Typography variant="body1">{asset.ownerName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Current Value
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(asset.value, asset.currency)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Purchase Price
                </Typography>
                <Typography variant="body1">
                  {asset.purchasePrice ? formatCurrency(asset.purchasePrice, asset.currency) : '-'}
                </Typography>
              </Grid>
              {asset.purchaseDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Purchase Date
                  </Typography>
                  <Typography variant="body1">{formatDate(asset.purchaseDate)}</Typography>
                </Grid>
              )}
              {asset.location && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{asset.location}</Typography>
                </Grid>
              )}
              {asset.manufacturer && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Manufacturer
                  </Typography>
                  <Typography variant="body1">{asset.manufacturer}</Typography>
                </Grid>
              )}
              {asset.model && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Model
                  </Typography>
                  <Typography variant="body1">{asset.model}</Typography>
                </Grid>
              )}
              {asset.serialNumber && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Serial Number
                  </Typography>
                  <Typography variant="body1">{asset.serialNumber}</Typography>
                </Grid>
              )}
              {asset.year && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Year
                  </Typography>
                  <Typography variant="body1">{asset.year}</Typography>
                </Grid>
              )}
              {asset.condition && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Condition
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {asset.condition}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {asset.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{asset.description}</Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Current Value"
                    secondary={formatCurrency(asset.value, asset.currency)}
                  />
                </ListItem>
                {asset.purchasePrice && (
                  <ListItem>
                    <ListItemText
                      primary="Purchase Price"
                      secondary={formatCurrency(asset.purchasePrice, asset.currency)}
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemText
                    primary="Created"
                    secondary={formatDate(asset.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={formatDate(asset.updatedAt)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Asset"
        message="Are you sure you want to delete this asset? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};
