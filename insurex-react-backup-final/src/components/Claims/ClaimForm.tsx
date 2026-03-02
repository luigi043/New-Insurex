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
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { claimService } from '../../services/claim.service';
import { policyService } from '../../services/policy.service';

export const ClaimForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [policies, setPolicies] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    claimNumber: '',
    policyId: '',
    incidentDate: new Date().toISOString().split('T')[0],
    description: '',
    incidentLocation: '',
    claimedAmount: '',
    type: 'PropertyDamage',
  });

  const steps = ['Claim Information', 'Incident Details', 'Review'];
  const claimTypes = [
    'PropertyDamage', 'Theft', 'Liability', 'PersonalInjury',
    'BusinessInterruption', 'VehicleAccident', 'NaturalDisaster',
    'Fire', 'Other'
  ];

  useEffect(() => {
    loadPolicies();
    if (id) {
      loadClaim();
    }
  }, [id]);

  const loadPolicies = async () => {
    try {
      const response = await policyService.getPolicies(1, 100);
      setPolicies(response.data.items);
    } catch (error) {
      console.error('Failed to load policies:', error);
    }
  };

  const loadClaim = async () => {
    try {
      const response = await claimService.getClaim(id!);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load claim');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (id) {
        await claimService.updateClaim(id, formData);
      } else {
        await claimService.createClaim(formData);
      }
      navigate('/claims');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save claim');
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="claimNumber"
                label="Claim Number"
                value={formData.claimNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Policy</InputLabel>
                <Select
                  name="policyId"
                  value={formData.policyId}
                  label="Policy"
                  onChange={handleChange}
                >
                  {policies.map((policy) => (
                    <MenuItem key={policy.id} value={policy.id}>
                      {policy.policyNumber} - {policy.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Claim Description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Claim Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Claim Type"
                  onChange={handleChange}
                >
                  {claimTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                name="incidentDate"
                label="Incident Date"
                InputLabelProps={{ shrink: true }}
                value={formData.incidentDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="incidentLocation"
                label="Incident Location"
                value={formData.incidentLocation}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                name="claimedAmount"
                label="Claimed Amount ($)"
                value={formData.claimedAmount}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Claim Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Claim Number:</Typography>
                <Typography variant="body1" gutterBottom>{formData.claimNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Type:</Typography>
                <Typography variant="body1" gutterBottom>{formData.type}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">Description:</Typography>
                <Typography variant="body1" gutterBottom>{formData.description}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Incident Date:</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(formData.incidentDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Claimed Amount:</Typography>
                <Typography variant="body1" gutterBottom>
                  ${Number(formData.claimedAmount).toLocaleString()}
                </Typography>
              </Grid>
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
        {id ? 'Edit' : 'New'} Claim
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
                {loading ? 'Submitting...' : 'Submit Claim'}
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