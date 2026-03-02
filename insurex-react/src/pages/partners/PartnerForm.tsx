import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, Grid, MenuItem, CircularProgress } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNotification } from '../../hooks/useNotification';

export const PartnerForm: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    type: 'broker',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    commissionRate: 10,
    licenseNumber: '',
    website: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' },
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setTimeout(() => {
      showSuccess('Partner saved successfully');
      setIsSaving(false);
      navigate('/partners');
    }, 1000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/partners')}>Back</Button>
          <Typography variant="h4">New Partner</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Company Name" value={formData.companyName} onChange={handleChange('companyName')} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Partner Type" value={formData.type} onChange={handleChange('type')} required>
              <MenuItem value="broker">Broker</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="referrer">Referrer</MenuItem>
              <MenuItem value="affiliate">Affiliate</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Contact Person" value={formData.contactPerson} onChange={handleChange('contactPerson')} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Contact Email" type="email" value={formData.contactEmail} onChange={handleChange('contactEmail')} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Contact Phone" value={formData.contactPhone} onChange={handleChange('contactPhone')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Commission Rate (%)" type="number" value={formData.commissionRate} onChange={handleChange('commissionRate')} InputProps={{ inputProps: { min: 0, max: 100 } }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="License Number" value={formData.licenseNumber} onChange={handleChange('licenseNumber')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Website" value={formData.website} onChange={handleChange('website')} />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" startIcon={isSaving ? <CircularProgress size={20} /> : <Save />} onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Partner'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
