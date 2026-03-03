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
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Chip
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  Save,
  Lock,
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  VpnKey
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
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingOptIn: false,
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    securityAlerts: true
  });

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
      showSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err) {
      showError('Erro ao atualizar perfil');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('As senhas não coincidem');
      return;
    }
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      showSuccess('Senha alterada com sucesso!');
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError('Erro ao alterar senha');
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

  const handlePreferenceChange = (field: keyof typeof preferences, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferencesSave = () => {
    showSuccess('Preferências salvas com sucesso!');
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
      <Typography variant="h4" sx={{ mb: 3 }}>Meu Perfil</Typography>

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
                Editar Perfil
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Salvar
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<Person />} label="Informações Pessoais" />
          <Tab icon={<Business />} label="Empresa" />
          <Tab icon={<VpnKey />} label="Segurança" />
          <Tab icon={<Email />} label="Preferências" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sobrenome"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CPF"
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
                label="Cargo"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Departamento"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box>
            <Typography variant="h6" gutterBottom>Alterar Senha</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Recomendamos usar uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Lock />}
              onClick={() => setPasswordDialogOpen(true)}
            >
              Alterar Senha
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notificações
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.emailNotifications}
                        onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Receber notificações por email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.smsNotifications}
                        onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label="Receber notificações por SMS"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.securityAlerts}
                        onChange={(e) => handlePreferenceChange('securityAlerts', e.target.checked)}
                      />
                    }
                    label="Alertas de segurança"
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Conta
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="language-select-label">Idioma</InputLabel>
                    <Select
                      labelId="language-select-label"
                      value={preferences.language}
                      label="Idioma"
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <MenuItem value="pt-BR">Português (BR)</MenuItem>
                      <MenuItem value="en-US">English (US)</MenuItem>
                      <MenuItem value="es-ES">Español</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="timezone-select-label">Fuso horário</InputLabel>
                    <Select
                      labelId="timezone-select-label"
                      value={preferences.timezone}
                      label="Fuso horário"
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    >
                      <MenuItem value="America/Sao_Paulo">America/Sao_Paulo</MenuItem>
                      <MenuItem value="America/Mexico_City">America/Mexico_City</MenuItem>
                      <MenuItem value="America/New_York">America/New_York</MenuItem>
                      <MenuItem value="Europe/Lisbon">Europe/Lisbon</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ mt: 2 }}>
                    <Chip label="Plano Enterprise" color="primary" variant="outlined" />
                  </Box>
                  <FormControlLabel
                    sx={{ mt: 1 }}
                    control={
                      <Switch
                        checked={preferences.marketingOptIn}
                        onChange={(e) => handlePreferenceChange('marketingOptIn', e.target.checked)}
                      />
                    }
                    label="Aceitar comunicações sobre novidades"
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handlePreferencesSave}>
                  Salvar Preferências
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Senha Atual"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Nova Senha"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirmar Nova Senha"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Alterar Senha
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
