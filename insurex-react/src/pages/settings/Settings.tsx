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
    companyName: 'InsureX Seguros',
    companyDocument: '00.000.000/0000-00',
    companyEmail: 'contato@insurex.com',
    companyPhone: '(11) 3000-0000',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BRL'
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
    showSuccess('Configurações gerais salvas com sucesso!');
  };

  const handleSaveNotifications = () => {
    showSuccess('Configurações de notificações salvas com sucesso!');
  };

  const handleSaveSecurity = () => {
    showSuccess('Configurações de segurança salvas com sucesso!');
  };

  const renderGeneralSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Informações da Empresa</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nome da Empresa"
            value={generalSettings.companyName}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="CNPJ"
            value={generalSettings.companyDocument}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyDocument: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="E-mail"
            value={generalSettings.companyEmail}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Telefone"
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
            <InputLabel>Idioma</InputLabel>
            <Select
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
            >
              <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
              <MenuItem value="en-US">English (US)</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Fuso Horário</InputLabel>
            <Select
              value={generalSettings.timezone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <MenuItem value="America/Sao_Paulo">São Paulo (GMT-3)</MenuItem>
              <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
              <MenuItem value="Europe/London">London (GMT+0)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Formato de Data</InputLabel>
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
            <InputLabel>Moeda</InputLabel>
            <Select
              value={generalSettings.currency}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
            >
              <MenuItem value="BRL">Real (R$)</MenuItem>
              <MenuItem value="USD">Dollar ($)</MenuItem>
              <MenuItem value="EUR">Euro (€)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleSaveGeneral}>
          Salvar Alterações
        </Button>
      </Box>
    </Box>
  );

  const renderNotificationSettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Canais de Notificação</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Notificações por E-mail"
            secondary="Receber notificações importantes por e-mail"
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
            primary="Notificações Push"
            secondary="Receber notificações em tempo real no navegador"
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

      <Typography variant="h6" gutterBottom>Eventos</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Alertas de Sinistros"
            secondary="Notificar quando novos sinistros forem registrados"
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
            primary="Vencimento de Apólices"
            secondary="Alertar sobre apólices próximas do vencimento"
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
            primary="Lembretes de Pagamento"
            secondary="Enviar lembretes de faturas próximas do vencimento"
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
          Salvar Alterações
        </Button>
      </Box>
    </Box>
  );

  const renderSecuritySettings = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Autenticação</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Autenticação de Dois Fatores"
            secondary="Exigir código adicional no login"
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

      <Typography variant="h6" gutterBottom>Sessão</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Timeout da Sessão (minutos)"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Expiração de Senha (dias)"
            value={securitySettings.passwordExpiration}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiration: parseInt(e.target.value) }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Tentativas de Login"
            value={securitySettings.loginAttempts}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleSaveSecurity}>
          Salvar Alterações
        </Button>
      </Box>
    </Box>
  );

  const menuItems = [
    { id: 'general', label: 'Geral', icon: <Business /> },
    { id: 'notifications', label: 'Notificações', icon: <Notifications /> },
    { id: 'security', label: 'Segurança', icon: <Security /> }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Configurações</Typography>

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
