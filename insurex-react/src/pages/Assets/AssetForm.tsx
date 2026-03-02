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
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save,
  ArrowBack,
  AddPhotoAlternate,
  Delete,
  CloudUpload
} from '@mui/icons-material';
import { useAssets } from '../../hooks/useAssets';
import { usePolicies } from '../../hooks/usePolicies';
import { AssetType, AssetStatus, AssetFormData } from '../../types/asset.types';
import { formatCurrency } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';

const steps = ['Informações Básicas', 'Detalhes do Bem', 'Documentação', 'Revisão'];

const assetTypes = [
  { value: AssetType.VEHICLE, label: 'Veículo' },
  { value: AssetType.PROPERTY, label: 'Imóvel' },
  { value: AssetType.EQUIPMENT, label: 'Equipamento' },
  { value: AssetType.OTHER, label: 'Outro' }
];

const assetStatuses = [
  { value: AssetStatus.ACTIVE, label: 'Ativo' },
  { value: AssetStatus.INACTIVE, label: 'Inativo' },
  { value: AssetStatus.UNDER_MAINTENANCE, label: 'Em Manutenção' },
  { value: AssetStatus.DISPOSED, label: 'Descartado' }
];

export const AssetForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { showSuccess, showError } = useNotification();
  
  const { createAsset, updateAsset, getAssetById, loading, error } = useAssets();
  const { policies } = usePolicies();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    description: '',
    type: AssetType.OTHER,
    status: AssetStatus.ACTIVE,
    value: 0,
    purchaseDate: '',
    policyId: '',
    location: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    year: new Date().getFullYear(),
    documents: []
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && id) {
      loadAsset(id);
    }
  }, [isEditMode, id]);

  const loadAsset = async (assetId: string) => {
    try {
      const asset = await getAssetById(assetId);
      if (asset) {
        setFormData({
          name: asset.name,
          description: asset.description || '',
          type: asset.type,
          status: asset.status,
          value: asset.value,
          purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
          policyId: asset.policyId || '',
          location: asset.location || '',
          serialNumber: asset.serialNumber || '',
          manufacturer: asset.manufacturer || '',
          model: asset.model || '',
          year: asset.year || new Date().getFullYear(),
          documents: asset.documents || []
        });
      }
    } catch (err) {
      showError('Erro ao carregar dados do bem');
    }
  };

  const handleInputChange = (field: keyof AssetFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setDocuments(prev => [...prev, ...newFiles]);
      
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
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
        return Boolean(formData.name && formData.type && formData.value > 0);
      case 1:
        return true;
      case 2:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        documents: documents.map((file, index) => ({
          name: file.name,
          type: file.type,
          url: previewUrls[index] || ''
        }))
      };

      if (isEditMode && id) {
        await updateAsset(id, submitData);
        showSuccess('Bem atualizado com sucesso!');
      } else {
        await createAsset(submitData);
        showSuccess('Bem cadastrado com sucesso!');
      }
      navigate('/assets');
    } catch (err) {
      showError('Erro ao salvar bem');
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
                label="Nome do Bem"
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
                  {assetTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Valor"
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Aquisição"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Apólice Vinculada</InputLabel>
                <Select
                  value={formData.policyId}
                  onChange={(e) => handleInputChange('policyId', e.target.value)}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {policies.map(policy => (
                    <MenuItem key={policy.id} value={policy.id}>
                      {policy.policyNumber} - {policy.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {assetStatuses.map(status => (
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
                label="Localização"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Endereço ou local onde o bem está localizado"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Série"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fabricante"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Modelo"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Ano"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Documentos do Bem
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ mb: 3 }}
            >
              Adicionar Documentos
              <input
                type="file"
                hidden
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </Button>
            
            <Grid container spacing={2}>
              {previewUrls.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent sx={{ position: 'relative', p: 1 }}>
                      <img
                        src={url}
                        alt={`Documento ${index + 1}`}
                        style={{ width: '100%', height: 150, objectFit: 'cover' }}
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        {documents[index]?.name}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveDocument(index)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <Delete />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {documents.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <AddPhotoAlternate sx={{ fontSize: 48, mb: 2 }} />
                <Typography>
                  Nenhum documento anexado. Clique acima para adicionar.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revisão das Informações
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Nome</Typography>
                    <Typography>{formData.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                    <Typography>{assetTypes.find(t => t.value === formData.type)?.label}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Valor</Typography>
                    <Typography>{formatCurrency(formData.value)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Typography>{assetStatuses.find(s => s.value === formData.status)?.label}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Descrição</Typography>
                    <Typography>{formData.description || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Localização</Typography>
                    <Typography>{formData.location || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Documentos Anexados</Typography>
                    <Typography>{documents.length} documento(s)</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
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
          onClick={() => navigate('/assets')}
        >
          Voltar
        </Button>
        <Typography variant="h4">
          {isEditMode ? 'Editar Bem' : 'Novo Bem'}
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

export default AssetForm;
