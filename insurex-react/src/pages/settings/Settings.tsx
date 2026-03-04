import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Save,
  Business,
  Notifications,
  Security
} from '@mui/icons-material';
import { useNotification } from '../../hooks/useNotification';

export const Settings: React.FC = () => {
  const { showSuccess } = useNotification();
  const [activeSection, setActiveSection] = useState('general');

  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'InsureX South Africa',
    companyDocument: '00/000/000/0000',
    companyEmail: 'contact@insurex.co.za',
    companyPhone: '+27 11 000 0000',
    language: 'en-US',
    timezone: 'Africa/Johannesburg',
    dateFormat: 'DD/MM/YYYY',
    currency: 'ZAR'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    claimAlerts: true,
    policyExpirations: true,
    paymentReminders: true,
    dailyReports: false,
    weeklyReports: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiration: 90,
    loginAttempts: 5
  });

  // const [userDialogOpen, setUserDialogOpen] = useState(false);

  const handleSaveGeneral = () => {
    showSuccess('General settings saved successfully!');
  };

  const handleSaveNotifications = () => {
    showSuccess('Notification settings saved successfully!');
  };

  const handleSaveSecurity = () => {
    showSuccess('Security settings saved successfully!');
  };

  const renderGeneralSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Company Information</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Company Name"
            value={generalSettings.companyName}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Registration Number"
            value={generalSettings.companyDocument}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyDocument: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            value={generalSettings.companyEmail}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            value={generalSettings.companyPhone}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Regional</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
            >
              <MenuItem value="en-US">English (US)</MenuItem>
              <MenuItem value="en-ZA">English (South Africa)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Time Zone</InputLabel>
            <Select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <MenuItem value="Africa/Johannesburg">Johannesburg (GMT+2)</MenuItem>
              <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
              <MenuItem value="Europe/London">London (GMT+0)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Date Format</InputLabel>
            <Select
              value={generalSettings.dateFormat}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
            >
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select
              value={generalSettings.currency}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
            >
              <MenuItem value="ZAR">Rand (R)</MenuItem>
              <MenuItem value="USD">Dollar ($)</MenuItem>
              <MenuItem value="EUR">Euro (€)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleSaveGeneral}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );

  const renderNotificationSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Notification Channels</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Email Notifications"
            secondary="Receive important notifications by email"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Push Notifications"
            secondary="Receive real-time notifications in the browser"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Events</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Claim Alerts"
            secondary="Notify when new claims are registered"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notificationSettings.claimAlerts}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, claimAlerts: e.target.checked }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Policy Expirations"
            secondary="Alert about policies nearing expiration"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notificationSettings.policyExpirations}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, policyExpirations: e.target.checked }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Payment Reminders"
            secondary="Send reminders for invoices nearing due date"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={notificationSettings.paymentReminders}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, paymentReminders: e.target.checked }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleSaveNotifications}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );

  const renderSecuritySettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Authentication</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Two-Factor Authentication"
            secondary="Require an additional code at login"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Session</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Session Timeout (minutes)"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Password Expiration (days)"
            value={securitySettings.passwordExpiration}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiration: parseInt(e.target.value) }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Login Attempts"
            value={securitySettings.loginAttempts}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleSaveSecurity}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );

  const menuItems = [
    { id: 'general', label: 'General', icon: <Business /> },
    { id: 'notifications', label: 'Notifications', icon: <Notifications /> },
    { id: 'security', label: 'Security', icon: <Security /> }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper>
            <List>
              {menuItems.map(item => (
                <ListItem
                  key={item.id}
                  button
                  selected={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Box sx={{ mr: 2, color: activeSection === item.id ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </Box>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {activeSection === 'general' && renderGeneralSettings()}
            {activeSection === 'notifications' && renderNotificationSettings()}
            {activeSection === 'security' && renderSecuritySettings()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
