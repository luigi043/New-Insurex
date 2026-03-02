import React, { useState } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Divider, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Save } from '@mui/icons-material';
import { useNotification } from '../../hooks/useNotification';

export const Settings: React.FC = () => {
  const { showSuccess } = useNotification();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    autoLogout: true,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSave = () => {
    showSuccess('Settings saved successfully');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Notifications</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Email Notifications" secondary="Receive updates via email" />
            <ListItemSecondaryAction>
              <Switch checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="SMS Notifications" secondary="Receive updates via SMS" />
            <ListItemSecondaryAction>
              <Switch checked={settings.smsNotifications} onChange={() => handleToggle('smsNotifications')} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Push Notifications" secondary="Receive push notifications in browser" />
            <ListItemSecondaryAction>
              <Switch checked={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Marketing Emails" secondary="Receive promotional emails" />
            <ListItemSecondaryAction>
              <Switch checked={settings.marketingEmails} onChange={() => handleToggle('marketingEmails')} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Security</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Two-Factor Authentication" secondary="Enable 2FA for additional security" />
            <ListItemSecondaryAction>
              <Switch checked={settings.twoFactorAuth} onChange={() => handleToggle('twoFactorAuth')} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Auto Logout" secondary="Automatically logout after inactivity" />
            <ListItemSecondaryAction>
              <Switch checked={settings.autoLogout} onChange={() => handleToggle('autoLogout')} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
