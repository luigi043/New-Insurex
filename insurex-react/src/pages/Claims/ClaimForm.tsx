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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Save,
  ArrowBack,
  CloudUpload,
  Delete,
  AddPhotoAlternate
} from '@mui/icons-material';
import { useClaims } from '../../hooks/useClaims';
import { usePolicies } from '../../hooks/usePolicies';
import { useAssets } from '../../hooks/useAssets';
import { ClaimStatus, ClaimType, ClaimFormData } from '../../types/claim.types';
import { formatCurrency } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';

const steps = ['Informações do Sinistro', 'Detalhes do Ocorrido', 'Documentação', 'Revisão'];

const claimTypes = [
  { value: ClaimType.THEFT, label: 'Roubo/Furto' },
  { value: ClaimType.ACCIDENT, label: 'Acidente' },
  { value: ClaimType.DAMAGE, label: 'Danos' },
  { value: ClaimType.LOSS, label: 'Perda' },
  { value: ClaimType.OTHER, label: 'Outro' }
];

const claimStatuses = [
  { value: ClaimStatus.PENDING, label: 'Pendente' },
  { value: ClaimStatus.UNDER_REVIEW, label: 'Em Análise' },
  { value: ClaimStatus.APPROVED, label: 'Aprovado' },
  { value: ClaimStatus.REJECTED, label: 'Rejeitado' },
  { value: ClaimStatus.SETTLED, label: 'Liquidado' }
];

export const ClaimForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { showSuccess, showError } = useNotification();
  
  const { createClaim, updateClaim, getClaimById, loading, error } = useClaims();
  const { policies } = usePolicies();
  const { assets } = useAssets();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ClaimFormData>({
    policyId: '',
    assetId: '',
    type: ClaimType.OTHER,
    status: ClaimStatus.PENDING,
    description: '',
    incidentDate: '',
    incidentLocation: '',
    claimedAmount: 0,
    approvedAmount: 0,
    documents: [],
    notes: ''
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && id) {
      loadClaim(id);
    }
  }, [isEditMode, id]);

  const loadClaim = async (claimId: string) => {
    try {
      const claim = await getClaimById(claimId);
      if (claim) {
        setFormData({
          policyId: claim.policyId,
          assetId: claim.assetId || '',
          type: claim.type,
          status: claim.status,
          description: claim.description,
          incidentDate: claim.incidentDate ? claim.incidentDate.split('T')[0] : '',
          incidentLocation: claim.incidentLocation || '',
          claimedAmount: claim.claimedAmount || 0,
          approvedAmount: claim.approvedAmount || 0,
          documents: claim.documents || [],
          notes: claim.notes || ''
        });
      }
    } catch (err) {
      showError('Erro ao carregar dados do sinistro');
    }
  };

  const handleInputChange = (field: keyof ClaimFormData, value: any) => {
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
        return Boolean(formData.policyId && formData.type && formData.description);
      case 1:
        return Boolean(formData.incidentDate && formData.claimedAmount > 0);
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
        await updateClaim(id, submitData);
        showSuccess('Sinistro atualizado com sucesso!');
      } else {
        await createClaim(submitData);
        showSuccess('Sinistro registrado com sucesso!');
      }
      navigate('/claims');
    } catch (err) {
      showError('Erro ao salvar sinistro');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Apólice</InputLabel>
                <Select
                  value={formData.policyId}
                  onChange={(e) => handleInputChange('policyId', e.target.value)}
                >
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
                <InputLabel>Bem Segurado</InputLabel>
                <Select
                  value={formData.assetId}
                  onChange={(e) => handleInputChange('assetId', e.target.value)}
                >
                  <MenuItem value="">Nenhum</MenuItem>
                  {assets
                    .filter(a => !formData.policyId || a.policyId === formData.policyId)
                    .map(asset => (
                      <MenuItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Sinistro</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  {claimTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
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
                  {claimStatuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição do Sinistro"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                placeholder="Descreva detalhadamente o que aconteceu..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data do Ocorrido"
                value={formData.incidentDate}
                onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Local do Ocorrido"
                value={formData.incidentLocation}
                onChange={(e) => handleInputChange('incidentLocation', e.target.value)}
                placeholder="Onde o incidente ocorreu?"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Valor Reivindicado"
                value={formData.claimedAmount}
                onChange={(e) => handleInputChange('claimedAmount', parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>
                }}
                required
              />
            </Grid>
            {isEditMode && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Valor Aprovado"
                  value={formData.approvedAmount}
                  onChange={(e) => handleInputChange('approvedAmount', parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Observações Internas"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas internas sobre o sinistro..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Documentos do Sinistro
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Anexe fotos, boletins de ocorrência, orçamentos e outros documentos relevantes.
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
                    <Typography variant="subtitle2" color="text.secondary">Apólice</Typography>
                    <Typography>
                      {policies.find(p => p.id === formData.policyId)?.policyNumber || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                    <Typography>{claimTypes.find(t => t.value === formData.type)?.label}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Descrição</Typography>
                    <Typography>{formData.description}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Data do Ocorrido</Typography>
                    <Typography>{formData.incidentDate}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Local</Typography>
                    <Typography>{formData.incidentLocation || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Valor Reivindicado</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(formData.claimedAmount)}
                    </Typography>
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
          onClick={() => navigate('/claims')}
        >
          Voltar
        </Button>
        <Typography variant="h4">
          {isEditMode ? 'Editar Sinistro' : 'Novo Sinistro'}
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

export default ClaimForm;
