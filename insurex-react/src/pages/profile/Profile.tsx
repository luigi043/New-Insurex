import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Avatar, Divider, Tabs, Tab } from '@mui/material';
import { Save, PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      showSuccess('Profile updated successfully');
    } catch (err: any) {
      showError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Profile</Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 2 }} src={user?.avatarUrl}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h5">{user?.fullName}</Typography>
            <Typography variant="body2" color="textSecondary">{user?.email}</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>{user?.role}</Typography>
          </Box>
          <Button variant="outlined" startIcon={<PhotoCamera />} sx={{ ml: 'auto' }}>
            Change Photo
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ mb: 3 }}>
          <Tab label="Personal Information" />
          <Tab label="Security" />
          <Tab label="Preferences" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" value={formData.firstName} onChange={handleChange('firstName')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange('lastName')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" type="email" value={formData.email} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={formData.phone} onChange={handleChange('phone')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company" value={formData.company} onChange={handleChange('company')} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" startIcon={<Save />} onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Current Password" type="password" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="New Password" type="password" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Confirm New Password" type="password" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained">Change Password</Button>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Language" value="en">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Timezone" value="UTC">
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained">Save Preferences</Button>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};
