import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { assetService } from '../../services/asset.service';

interface AssetFormProps {
  assetType: string;
}

export const AssetForm: React.FC<AssetFormProps> = ({ assetType }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    value: '',
    status: 'Active',
    type: assetType,
    policyId: '',
    location: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
  });

  const steps = ['Basic Information', 'Asset Details', 'Review'];

  useEffect(() => {
    if (id) {
      loadAsset();
    }
  }, [id]);

  const loadAsset = async () => {
    try {
      const response = await assetService.getAsset(id!);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load asset');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (id) {
        await assetService.updateAsset(id, formData);
      } else {
        await assetService.createAsset(formData);
      }
      navigate('/assets');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderAssetSpecificFields = () => {
    switch (assetType) {
      case 'Vehicle':
        return <VehicleAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'Property':
        return <PropertyAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'Watercraft':
        return <WatercraftAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'Aviation':
        return <AviationAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'StockInventory':
        return <StockInventoryAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'AccountsReceivable':
        return <AccountsReceivableAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'Machinery':
        return <MachineryAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'PlantEquipment':
        return <PlantEquipmentAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'BusinessInterruption':
        return <BusinessInterruptionAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'KeymanInsurance':
        return <KeymanInsuranceAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      case 'ElectronicEquipment':
        return <ElectronicEquipmentAssetFields formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="name"
                label="Asset Name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                name="value"
                label="Value ($)"
                value={formData.value}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="UnderMaintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Disposed">Disposed</MenuItem>
                  <MenuItem value="Claimed">Claimed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="policyId"
                label="Policy ID"
                value={formData.policyId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                name="acquisitionDate"
                label="Acquisition Date"
                InputLabelProps={{ shrink: true }}
                value={formData.acquisitionDate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return renderAssetSpecificFields();
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Asset Information</Typography>
            <Grid container spacing={2}>
              {Object.entries(formData).map(([key, value]) => (
                <Grid item xs={12} md={6} key={key}>
                  <Typography variant="body2" color="textSecondary">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Typography>
                  <Typography variant="body1">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit' : 'New'} {assetType} Asset
      </Typography>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Submit'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

// Vehicle Asset Fields
const VehicleAssetFields: React.FC<any> = ({ formData, handleChange, handleCheckboxChange }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <TextField fullWidth name="make" label="Make" value={formData.make || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField fullWidth name="model" label="Model" value={formData.model || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth type="number" name="year" label="Year" value={formData.year || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="registrationNumber" label="Registration Number" value={formData.registrationNumber || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="vinNumber" label="VIN Number" value={formData.vinNumber || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="engineNumber" label="Engine Number" value={formData.engineNumber || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="color" label="Color" value={formData.color || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth type="number" name="mileage" label="Mileage" value={formData.mileage || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <FormControl fullWidth>
        <InputLabel>Vehicle Type</InputLabel>
        <Select name="vehicleType" value={formData.vehicleType || ''} label="Vehicle Type" onChange={handleChange}>
          <MenuItem value="Car">Car</MenuItem>
          <MenuItem value="Truck">Truck</MenuItem>
          <MenuItem value="Motorcycle">Motorcycle</MenuItem>
          <MenuItem value="Bus">Bus</MenuItem>
          <MenuItem value="Van">Van</MenuItem>
          <MenuItem value="Trailer">Trailer</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} md={4}>
      <FormControl fullWidth>
        <InputLabel>Fuel Type</InputLabel>
        <Select name="fuelType" value={formData.fuelType || ''} label="Fuel Type" onChange={handleChange}>
          <MenuItem value="Petrol">Petrol</MenuItem>
          <MenuItem value="Diesel">Diesel</MenuItem>
          <MenuItem value="Electric">Electric</MenuItem>
          <MenuItem value="Hybrid">Hybrid</MenuItem>
          <MenuItem value="LPG">LPG</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            name="isCommercial"
            checked={formData.isCommercial || false}
            onChange={handleCheckboxChange}
          />
        }
        label="Commercial Vehicle"
      />
    </Grid>
  </Grid>
);

// Property Asset Fields
const PropertyAssetFields: React.FC<any> = ({ formData, handleChange, handleCheckboxChange }) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <FormControl fullWidth>
        <InputLabel>Property Type</InputLabel>
        <Select name="propertyType" value={formData.propertyType || ''} label="Property Type" onChange={handleChange}>
          <MenuItem value="Residential">Residential</MenuItem>
          <MenuItem value="Commercial">Commercial</MenuItem>
          <MenuItem value="Industrial">Industrial</MenuItem>
          <MenuItem value="Agricultural">Agricultural</MenuItem>
          <MenuItem value="MixedUse">Mixed Use</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12}>
      <TextField fullWidth name="address" label="Address" value={formData.address || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="city" label="City" value={formData.city || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="state" label="State" value={formData.state || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="zipCode" label="Zip Code" value={formData.zipCode || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth name="country" label="Country" value={formData.country || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth type="number" name="squareFeet" label="Square Feet" value={formData.squareFeet || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField fullWidth type="number" name="yearBuilt" label="Year Built" value={formData.yearBuilt || ''} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} md={4}>
      <FormControl fullWidth>
        <InputLabel>Construction Type</InputLabel>
        <Select name="constructionType" value={formData.constructionType || ''} label="Construction Type" onChange={handleChange}>
          <MenuItem value="WoodFrame">Wood Frame</MenuItem>
          <MenuItem value="SteelFrame">Steel Frame</MenuItem>
          <MenuItem value="Concrete">Concrete</MenuItem>
          <MenuItem value="Brick">Brick</MenuItem>
          <MenuItem value="Stone">Stone</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            name="hasSecuritySystem"
            checked={formData.hasSecuritySystem || false}
            onChange={handleCheckboxChange}
          />
        }
        label="Has Security System"
      />
    </Grid>
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            name="hasFireAlarm"
            checked={formData.hasFireAlarm || false}
            onChange={handleCheckboxChange}
          />
        }
        label="Has Fire Alarm"
      />
    </Grid>
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            name="hasSprinklerSystem"
            checked={formData.hasSprinklerSystem || false}
            onChange={handleCheckboxChange}
          />
        }
        label="Has Sprinkler System"
      />
    </Grid>
  </Grid>
);

// Add other asset type fields similarly...
// WatercraftAssetFields, AviationAssetFields, StockInventoryAssetFields,
// AccountsReceivableAssetFields, MachineryAssetFields, PlantEquipmentAssetFields,
// BusinessInterruptionAssetFields, KeymanInsuranceAssetFields, ElectronicEquipmentAssetFields