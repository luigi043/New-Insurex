import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { assetService } from '../../services/asset.service';
import { AssetType, AssetStatus, AssetCondition } from '../../types/asset.types';
import { useNotification } from '../../hooks/useNotification';

const steps = ['Basic Information', 'Details & Value', 'Additional Info'];

const assetTypes: { value: AssetType; label: string }[] = [
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

export const AssetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const isEditMode = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'other' as AssetType,
    description: '',
    ownerId: '',
    value: 0,
    currency: 'USD',
    purchaseDate: '',
    purchasePrice: 0,
    location: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    registrationNumber: '',
    year: new Date().getFullYear(),
    condition: 'good' as AssetCondition,
    status: 'active' as AssetStatus,
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchAsset(id);
    }
  }, [isEditMode, id]);

  const fetchAsset = async (assetId: string) => {
    setIsLoading(true);
    try {
      const asset = await assetService.getAsset(assetId);
      setFormData({
        name: asset.name,
        type: asset.type,
        description: asset.description || '',
        ownerId: asset.ownerId,
        value: asset.value,
        currency: asset.currency,
        purchaseDate: asset.purchaseDate?.split('T')[0] || '',
        purchasePrice: asset.purchasePrice || 0,
        location: asset.location || '',
        manufacturer: asset.manufacturer || '',
        model: asset.model || '',
        serialNumber: asset.serialNumber || '',
        registrationNumber: asset.registrationNumber || '',
        year: asset.year || new Date().getFullYear(),
        condition: asset.condition || 'good',
        status: asset.status,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch asset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await assetService.updateAsset(id, formData);
        showSuccess('Asset updated successfully');
      } else {
        await assetService.createAsset(formData);
        showSuccess('Asset created successfully');
      }
      navigate('/assets');
    } catch (err: any) {
      setError(err.message || 'Failed to save asset');
      showError(err.message || 'Failed to save asset');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asset Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Asset Type"
                value={formData.type}
                onChange={handleChange('type')}
                required
              >
                {assetTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Owner ID"
                value={formData.ownerId}
                onChange={handleChange('ownerId')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={handleChange('status')}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="disposed">Disposed</MenuItem>
                <MenuItem value="under_maintenance">Under Maintenance</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Value"
                type="number"
                value={formData.value}
                onChange={handleChange('value')}
                required
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Currency"
                value={formData.currency}
                onChange={handleChange('currency')}
                required
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Purchase Price"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange('purchasePrice')}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purchase Date"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange('purchaseDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleChange('location')}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                value={formData.manufacturer}
                onChange={handleChange('manufacturer')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={handleChange('model')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Serial Number"
                value={formData.serialNumber}
                onChange={handleChange('serialNumber')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange('registrationNumber')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={handleChange('year')}
                InputProps={{ inputProps: { min: 1900, max: 2100 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Condition"
                value={formData.condition}
                onChange={handleChange('condition')}
              >
                <MenuItem value="excellent">Excellent</MenuItem>
                <MenuItem value="good">Good</MenuItem>
                <MenuItem value="fair">Fair</MenuItem>
                <MenuItem value="poor">Poor</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/assets')}>
            Back
          </Button>
          <Typography variant="h4">
            {isEditMode ? 'Edit Asset' : 'New Asset'}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button disabled={activeStep === 0 || isSaving} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditMode ? 'Update Asset' : 'Create Asset'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
