import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem, CircularProgress, Alert, Stepper, Step, StepLabel } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';
import { ClaimType } from '../../types/claim.types';
import { useNotification } from '../../hooks/useNotification';

const steps = ['Basic Information', 'Incident Details', 'Review & Submit'];

const claimTypes: { value: ClaimType; label: string }[] = [
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

export const ClaimForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const isEditMode = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    policyId: '',
    type: 'property_damage' as ClaimType,
    incidentDate: '',
    description: '',
    location: '',
    estimatedAmount: 0,
    currency: 'USD',
    causeOfLoss: '',
    injuries: false,
    injuriesDescription: '',
    policeReport: false,
    policeReportNumber: '',
    thirdPartyInvolved: false,
    thirdPartyDetails: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchClaim(id);
    }
  }, [isEditMode, id]);

  const fetchClaim = async (claimId: string) => {
    setIsLoading(true);
    try {
      const claim = await claimService.getClaim(claimId);
      setFormData({
        policyId: claim.policyId,
        type: claim.type,
        incidentDate: claim.incidentDate.split('T')[0],
        description: claim.description,
        location: claim.location || '',
        estimatedAmount: claim.estimatedAmount,
        currency: claim.currency,
        causeOfLoss: claim.causeOfLoss || '',
        injuries: claim.injuries || false,
        injuriesDescription: claim.injuriesDescription || '',
        policeReport: claim.policeReport || false,
        policeReportNumber: claim.policeReportNumber || '',
        thirdPartyInvolved: claim.thirdPartyInvolved || false,
        thirdPartyDetails: claim.thirdPartyDetails || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch claim');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : 
      event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (isEditMode && id) {
        await claimService.updateClaim(id, formData);
        showSuccess('Claim updated successfully');
      } else {
        await claimService.createClaim(formData);
        showSuccess('Claim created successfully');
      }
      navigate('/claims');
    } catch (err: any) {
      setError(err.message || 'Failed to save claim');
      showError(err.message || 'Failed to save claim');
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
              <TextField fullWidth label="Policy ID" value={formData.policyId} onChange={handleChange('policyId')} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Claim Type" value={formData.type} onChange={handleChange('type')} required>
                {claimTypes.map((type) => (<MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Incident Date" type="date" value={formData.incidentDate} onChange={handleChange('incidentDate')} required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location" value={formData.location} onChange={handleChange('location')} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={4} value={formData.description} onChange={handleChange('description')} required />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Estimated Amount" type="number" value={formData.estimatedAmount} onChange={handleChange('estimatedAmount')} required InputProps={{ inputProps: { min: 0, step: 0.01 } }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select fullWidth label="Currency" value={formData.currency} onChange={handleChange('currency')}>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Cause of Loss" value={formData.causeOfLoss} onChange={handleChange('causeOfLoss')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Police Report Number" value={formData.policeReportNumber} onChange={handleChange('policeReportNumber')} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Injuries Description" multiline rows={2} value={formData.injuriesDescription} onChange={handleChange('injuriesDescription')} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Third Party Details" multiline rows={2} value={formData.thirdPartyDetails} onChange={handleChange('thirdPartyDetails')} />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>Review Your Claim</Typography>
            <Typography variant="body2" color="textSecondary">Policy: {formData.policyId}</Typography>
            <Typography variant="body2" color="textSecondary">Type: {claimTypes.find(t => t.value === formData.type)?.label}</Typography>
            <Typography variant="body2" color="textSecondary">Incident Date: {formData.incidentDate}</Typography>
            <Typography variant="body2" color="textSecondary">Estimated Amount: {formData.estimatedAmount} {formData.currency}</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  if (isLoading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/claims')}>Back</Button>
          <Typography variant="h4">{isEditMode ? 'Edit Claim' : 'New Claim'}</Typography>
        </Box>
      </Box>

      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
        </Stepper>
        {renderStepContent()}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button disabled={activeStep === 0 || isSaving} onClick={handleBack}>Back</Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" startIcon={isSaving ? <CircularProgress size={20} /> : <Save />} onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditMode ? 'Update Claim' : 'Create Claim'}
            </Button>
          ) : (<Button variant="contained" onClick={handleNext}>Next</Button>)}
        </Box>
      </Paper>
    </Box>
  );
};
