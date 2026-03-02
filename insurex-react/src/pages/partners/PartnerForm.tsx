import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Business,
  Email,
  Phone,
  LocationOn,
  Person
} from '@mui/icons-material';
import { usePartners } from '../../hooks/usePartners';
import { PartnerType, PartnerStatus, PartnerFormData } from '../../types/partner.types';
import { useNotification } from '../../hooks/useNotification';

const steps = ['Informações Básicas', 'Dados de Contato', 'Configurações'];

const partnerTypes = [
  { value: PartnerType.BROKER, label: 'Corretor' },
  { value: PartnerType.AGENCY, label: 'Agência' },
  { value: PartnerType.ADJUSTER, label: 'Ajustador' },
  { value: PartnerType.REPAIR_SHOP, label: 'Oficina' },
  { value: PartnerType.OTHER, label: 'Outro' }
];

const partnerStatuses = [
  { value: PartnerStatus.ACTIVE, label: 'Ativo' },
  { value: PartnerStatus.INACTIVE, label: 'Inativo' },
  { value: PartnerStatus.SUSPENDED, label: 'Suspenso' },
  { value: PartnerStatus.PENDING, label: 'Pendente' }
];

export const PartnerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { showSuccess, showError } = useNotification();
  
  const { createPartner, updatePartner, getPartnerById, loading, error } = usePartners();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    type: PartnerType.OTHER,
    status: PartnerStatus.PENDING,
    document: '',
    email: '',
    phone: '',
    mobile: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    commission: 0,
    notes: ''
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadPartner(id);
    }
  }, [isEditMode, id]);

  const loadPartner = async (partnerId: string) => {
    try {
      const partner = await getPartnerById(partnerId);
      if (partner) {
        setFormData({
          name: partner.name,
          type: partner.type,
          status: partner.status,
          document: partner.document || '',
          email: partner.email,
          phone: partner.phone || '',
          mobile: partner.mobile || '',
          address: partner.address || {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: ''
          },
          commission: partner.commission || 0,
          notes: partner.notes || ''
        });
      }
    } catch (err) {
      showError('Erro ao carregar dados do parceiro');
    }
  };

  const handleInputChange = (field: keyof PartnerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof typeof formData.address, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return Boolean(formData.name && formData.type && formData.document);
      case 1:
        return Boolean(formData.email);
      case 2:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && id) {
        await updatePartner(id, formData);
        showSuccess('Parceiro atualizado com sucesso!');
      } else {
        await createPartner(formData);
        showSuccess('Parceiro cadastrado com sucesso!');
      }
      navigate('/partners');
    } catch (err) {
      showError('Erro ao salvar parceiro');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome/Razão Social"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {partnerTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CPF/CNPJ"
                value={formData.document}
                onChange={(e) => handleInputChange('document', e.target.value)}
                required
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {partnerStatuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Celular"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Endereço</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CEP"
                value={formData.address.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                placeholder="00000-000"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Rua"
                value={formData.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Número"
                value={formData.address.number}
                onChange={(e) => handleAddressChange('number', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Complemento"
                value={formData.address.complement}
                onChange={(e) => handleAddressChange('complement', e.target.value)}
                placeholder="Apto, Sala, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bairro"
                value={formData.address.neighborhood}
                onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cidade"
                value={formData.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="UF"
                value={formData.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Comissão (%)"
                value={formData.commission}
                onChange={(e) => handleInputChange('commission', parseFloat(e.target.value) || 0)}
                InputProps={{
                  endAdornment: <Typography>%</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Observações"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Informações adicionais sobre o parceiro..."
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (loading && isEditMode) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/partners')}
        >
          Voltar
        </Button>
        <Typography variant="h4">
          {isEditMode ? 'Editar Parceiro' : 'Novo Parceiro'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 4 }}>
          {renderStepContent()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Voltar
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Atualizar' : 'Salvar')}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Próximo
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PartnerForm;
