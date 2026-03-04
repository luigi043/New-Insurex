import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  Save,
  Lock,
  Person,
  Business,
  VpnKey,
  Security
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    document: '',
    position: '',
    department: '',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      setTwoFAEnabled(user.isTwoFactorEnabled || false);
    }
  }, [user]);

  const handleToggle2FA = async () => {
    try {
      const newState = !twoFAEnabled;
      await updateProfile({ isTwoFactorEnabled: newState });
      setTwoFAEnabled(newState);
      showSuccess(`Two-factor authentication ${newState ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      showError('Error updating 2FA');
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        document: user.document || '',
        position: user.position || '',
        department: user.department || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      showError('Error updating profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      showSuccess('Password changed successfully!');
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError('Error changing password');
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>My Profile</Typography>

      <Paper>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={formData.avatar}
              sx={{ width: 120, height: 120, fontSize: 48 }}
            >
              {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
            </Avatar>
            {isEditing && (
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <PhotoCamera />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </IconButton>
            )}
          </Box>
          <Box>
            <Typography variant="h5">
              {formData.firstName} {formData.lastName}
            </Typography>
            <Typography color="text.secondary">{formData.position}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.department}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<Person />} label="Personal Information" />
          <Tab icon={<Business />} label="Company" />
          <Tab icon={<VpnKey />} label="Security" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Number"
                value={formData.document}
                onChange={(e) => handleInputChange('document', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box>
            <Typography variant="h6" gutterBottom>Change Password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We recommend using a strong password with at least 8 characters, including uppercase, lowercase, numbers and symbols.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Lock />}
              onClick={() => setPasswordDialogOpen(true)}
            >
              Change Password
            </Button>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>Two-Factor Authentication (2FA)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add an extra layer of security to your account. When enabled, you will need to provide a verification code in addition to your password.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Security color={twoFAEnabled ? 'success' : 'action'} sx={{ fontSize: 40 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFAEnabled}
                    onChange={handleToggle2FA}
                    color="primary"
                  />
                }
                label={twoFAEnabled ? 'Active' : 'Inactive'}
              />
            </Box>
          </Box>
        </TabPanel>
      </Paper>

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
