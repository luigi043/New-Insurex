import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, TextField, Button, Grid, MenuItem, CircularProgress, Alert,
  Stepper, Step, StepLabel, IconButton, Divider, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { Add, Delete, ArrowBack, Save } from '@mui/icons-material';
import { policyService } from '../../services/policy.service';
import { PolicyType, PaymentFrequency } from '../../types/policy.types';
import { useNotification } from '../../hooks/useNotification';

const steps = ['Basic Information', 'Coverage Details', 'Benefits & Documents'];

const policyTypes: { value: PolicyType; label: string }[] = [
  { value: 'life', label: 'Life Insurance' },
  { value: 'health', label: 'Health Insurance' },
  { value: 'auto', label: 'Auto Insurance' },
  { value: 'home', label: 'Home Insurance' },
  { value: 'property', label: 'Property Insurance' },
  { value: 'liability', label: 'Liability Insurance' },
  { value: 'travel', label: 'Travel Insurance' },
  { value: 'business', label: 'Business Insurance' },
  { value: 'marine', label: 'Marine Insurance' },
  { value: 'agriculture', label: 'Agriculture Insurance' },
  { value: 'other', label: 'Other' },
];

const paymentFrequencies: { value: PaymentFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi-annual', label: 'Semi-Annual' },
  { value: 'annual', label: 'Annual' },
  { value: 'single', label: 'Single Payment' },
];

export const PolicyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const isEditMode = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'life' as PolicyType,
    holderId: '',
    startDate: '',
    endDate: '',
    premium: 0,
    coverageAmount: 0,
    deductible: 0,
    currency: 'USD',
    paymentFrequency: 'annual' as PaymentFrequency,
    description: '',
    terms: '',
    exclusions: [] as string[],
    benefits: [] as { name: string; description: string; coverageAmount: number }[],
    beneficiaries: [] as { name: string; relationship: string; percentage: number }[],
  });

  const [newBenefit, setNewBenefit] = useState({ name: '', description: '', coverageAmount: 0 });
  const [newExclusion, setNewExclusion] = useState('');
  const [newBeneficiary, setNewBeneficiary] = useState({ name: '', relationship: '', percentage: 0 });

  useEffect(() => {
    if (isEditMode && id) fetchPolicy(id);
  }, [isEditMode, id]);

  const fetchPolicy = async (policyId: string) => {
    setIsLoading(true);
    try {
      const policy = await policyService.getPolicy(policyId);
      setFormData({
        type: policy.type,
        holderId: policy.holderId,
        startDate: policy.startDate.split('T')[0],
        endDate: policy.endDate.split('T')[0],
        premium: policy.premium,
        coverageAmount: policy.coverageAmount,
        deductible: policy.deductible,
        currency: policy.currency,
        paymentFrequency: policy.paymentFrequency,
        description: policy.description || '',
        terms: policy.terms || '',
        exclusions: policy.exclusions || [],
        benefits: policy.benefits?.map(b => ({ name: b.name, description: b.description, coverageAmount: b.coverageAmount })) || [],
        beneficiaries: policy.beneficiaries?.map(b => ({ name: b.name, relationship: b.relationship, percentage: b.percentage })) || [],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch policy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (isEditMode && id) {
        await policyService.updatePolicy(id, formData);
        showSuccess('Policy updated successfully');
      } else {
        await policyService.createPolicy(formData);
        showSuccess('Policy created successfully');
      }
      navigate('/policies');
    } catch (err: any) {
      setError(err.message || 'Failed to save policy');
      showError(err.message || 'Failed to save policy');
    } finally {
      setIsSaving(false);
    }
  };

  const addBenefit = () => {
    if (newBenefit.name && newBenefit.coverageAmount > 0) {
      setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, { ...newBenefit }] }));
      setNewBenefit({ name: '', description: '', coverageAmount: 0 });
    }
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData((prev) => ({ ...prev, exclusions: [...prev.exclusions, newExclusion.trim()] }));
      setNewExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    setFormData((prev) => ({ ...prev, exclusions: prev.exclusions.filter((_, i) => i !== index) }));
  };

  const addBeneficiary = () => {
    if (newBeneficiary.name && newBeneficiary.relationship && newBeneficiary.percentage > 0) {
      setFormData((prev) => ({ ...prev, beneficiaries: [...prev.beneficiaries, { ...newBeneficiary }] }));
      setNewBeneficiary({ name: '', relationship: '', percentage: 0 });
    }
  };

  const removeBeneficiary = (index: number) => {
    setFormData((prev) => ({ ...prev, beneficiaries: prev.beneficiaries.filter((_, i) => i !== index) }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Policy Type" value={formData.type} onChange={handleChange('type')} required>
                {policyTypes.map((type) => (<MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Policy Holder ID" value={formData.holderId} onChange={handleChange('holderId')} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Start Date" type="date" value={formData.startDate} onChange={handleChange('startDate')} required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="End Date" type="date" value={formData.endDate} onChange={handleChange('endDate')} required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} value={formData.description} onChange={handleChange('description')} />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Premium" type="number" value={formData.premium} onChange={handleChange('premium')} required InputProps={{ inputProps: { min: 0, step: 0.01 } }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Coverage Amount" type="number" value={formData.coverageAmount} onChange={handleChange('coverageAmount')} required InputProps={{ inputProps: { min: 0, step: 0.01 } }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Deductible" type="number" value={formData.deductible} onChange={handleChange('deductible')} InputProps={{ inputProps: { min: 0, step: 0.01 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Currency" value={formData.currency} onChange={handleChange('currency')} required>
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Payment Frequency" value={formData.paymentFrequency} onChange={handleChange('paymentFrequency')} required>
                {paymentFrequencies.map((freq) => (<MenuItem key={freq.value} value={freq.value}>{freq.label}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Terms & Conditions" multiline rows={5} value={formData.terms} onChange={handleChange('terms')} />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Benefits</Typography>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Benefit Name" value={newBenefit.name} onChange={(e) => setNewBenefit({ ...newBenefit, name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Description" value={newBenefit.description} onChange={(e) => setNewBenefit({ ...newBenefit, description: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField fullWidth label="Coverage Amount" type="number" value={newBenefit.coverageAmount} onChange={(e) => setNewBenefit({ ...newBenefit, coverageAmount: parseFloat(e.target.value) })} />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Button variant="contained" onClick={addBenefit} fullWidth><Add /></Button>
                    </Grid>
                  </Grid>
                  {formData.benefits.length > 0 && (
                    <TableContainer sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow><TableCell>Name</TableCell><TableCell>Description</TableCell><TableCell align="right">Coverage</TableCell><TableCell align="center">Action</TableCell></TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.benefits.map((benefit, index) => (
                            <TableRow key={index}>
                              <TableCell>{benefit.name}</TableCell>
                              <TableCell>{benefit.description}</TableCell>
                              <TableCell align="right">{benefit.coverageAmount}</TableCell>
                              <TableCell align="center"><IconButton size="small" color="error" onClick={() => removeBenefit(index)}><Delete /></IconButton></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/policies')}>Back</Button>
          <Typography variant="h4">{isEditMode ? 'Edit Policy' : 'New Policy'}</Typography>
        </Box>
      </Box>

      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
        </Stepper>
        {renderStepContent()}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={activeStep === 0 || isSaving} onClick={handleBack}>Back</Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" startIcon={isSaving ? <CircularProgress size={20} /> : <Save />} onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditMode ? 'Update Policy' : 'Create Policy'}
            </Button>
          ) : (<Button variant="contained" onClick={handleNext}>Next</Button>)}
        </Box>
      </Paper>
    </Box>
  );
};

export default PolicyForm;
