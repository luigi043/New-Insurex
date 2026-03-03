import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material';
import {
  Edit,
  ArrowBack,
  Delete,
  CalendarToday,
  AttachMoney,
  ConfirmationNumber,
  LocationOn,
  Description,
  Image as ImageIcon,
  CheckCircle,
  Pending,
  Cancel,
  Warning,
  Visibility
} from '@mui/icons-material';
import { useClaims } from '../../hooks/useClaims';
import { ClaimStatus, ClaimType } from '../../types/claim.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { InvestigationNotes } from '../../components/Claims/InvestigationNotes';
import { useNotification } from '../../hooks/useNotification';

const claimTypeLabels: Record<ClaimType, string> = {
  [ClaimType.THEFT]: 'Roubo/Furto',
  [ClaimType.ACCIDENT]: 'Acidente',
  [ClaimType.DAMAGE]: 'Danos',
  [ClaimType.LOSS]: 'Perda',
  [ClaimType.OTHER]: 'Outro'
};

const claimStatusColors: Record<ClaimStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  [ClaimStatus.PENDING]: 'warning',
  [ClaimStatus.UNDER_REVIEW]: 'info',
  [ClaimStatus.APPROVED]: 'success',
  [ClaimStatus.REJECTED]: 'error',
  [ClaimStatus.SETTLED]: 'default'
};

const claimStatusLabels: Record<ClaimStatus, string> = {
  [ClaimStatus.PENDING]: 'Pendente',
  [ClaimStatus.UNDER_REVIEW]: 'Em Análise',
  [ClaimStatus.APPROVED]: 'Aprovado',
  [ClaimStatus.REJECTED]: 'Rejeitado',
  [ClaimStatus.SETTLED]: 'Liquidado'
};

const getStatusStep = (status: ClaimStatus): number => {
  switch (status) {
    case ClaimStatus.PENDING: return 0;
    case ClaimStatus.UNDER_REVIEW: return 1;
    case ClaimStatus.APPROVED: return 2;
    case ClaimStatus.REJECTED: return 2;
    case ClaimStatus.SETTLED: return 3;
    default: return 0;
  }
};

export const ClaimDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useNotification();
  
  const { getClaimById, deleteClaim, updateClaim, loading, error } = useClaims();
  const [claim, setClaim] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ClaimStatus>(ClaimStatus.PENDING);
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadClaim(id);
    }
  }, [id]);

  const loadClaim = async (claimId: string) => {
    try {
      const data = await getClaimById(claimId);
      setClaim(data);
    } catch (err) {
      showError('Erro ao carregar detalhes do sinistro');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteClaim(id);
      showSuccess('Sinistro excluído com sucesso!');
      navigate('/claims');
    } catch (err) {
      showError('Erro ao excluir sinistro');
    }
  };

  const handleStatusChange = async () => {
    if (!id) return;
    
    try {
      await updateClaim(id, { 
        status: newStatus,
        notes: statusNotes 
      });
      showSuccess('Status atualizado com sucesso!');
      loadClaim(id);
      setStatusDialogOpen(false);
    } catch (err) {
      showError('Erro ao atualizar status');
    }
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setImageDialogOpen(true);
  };

  const openStatusDialog = () => {
    setNewStatus(claim?.status || ClaimStatus.PENDING);
    setStatusNotes('');
    setStatusDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !claim) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/claims')} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">
          {error || 'Sinistro não encontrado'}
        </Alert>
      </Box>
    );
  }

  const statusSteps = ['Registrado', 'Em Análise', 'Decisão', 'Liquidado'];
  const currentStep = getStatusStep(claim.status);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/claims')}>
            Voltar
          </Button>
          <Box>
            <Typography variant="h4">Sinistro #{claim.claimNumber}</Typography>
            <Typography variant="body2" color="text.secondary">
              Registrado em {formatDate(claim.createdAt)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/claims/edit/${id}`)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            onClick={openStatusDialog}
          >
            Alterar Status
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Excluir
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {statusSteps.map((label, index) => (
            <Step key={label} completed={index < currentStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6">Informações do Sinistro</Typography>
              <Chip
                label={claimStatusLabels[claim.status]}
                color={claimStatusColors[claim.status]}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                <Typography>{claimTypeLabels[claim.type]}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Data do Ocorrido</Typography>
                <Typography>{formatDate(claim.incidentDate)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Descrição</Typography>
                <Typography>{claim.description}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Local</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" color="action" />
                  {claim.incidentLocation || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Valores</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Valor Reivindicado</Typography>
                <Typography variant="h5" color="primary">{formatCurrency(claim.claimedAmount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Valor Aprovado</Typography>
                <Typography variant="h5" color={claim.approvedAmount ? 'success.main' : 'text.secondary'}>
                  {formatCurrency(claim.approvedAmount || 0)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {claim.documents && claim.documents.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Documentos</Typography>
              <Divider sx={{ mb: 2 }} />
              <ImageList cols={3} gap={8}>
                {claim.documents.map((doc: any, index: number) => (
                  <ImageListItem
                    key={index}
                    onClick={() => handleImageClick(doc.url)}
                    sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    {doc.type?.startsWith('image/') ? (
                      <img
                        src={doc.url}
                        alt={doc.name}
                        loading="lazy"
                        style={{ height: 150, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 150,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.100',
                          borderRadius: 1
                        }}
                      >
                        <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="caption" align="center" sx={{ px: 1 }}>
                          {doc.name}
                        </Typography>
                      </Box>
                    )}
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          )}
        </Grid>

        {/* Investigation Notes - Full Width */}
        <Grid item xs={12} lg={8}>
          <InvestigationNotes claimId={id || ''} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Apólice</Typography>
              <Divider sx={{ mb: 2 }} />
              {claim.policy ? (
                <Box>
                  <Typography variant="subtitle1">{claim.policy.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nº: {claim.policy.policyNumber}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/policies/${claim.policyId}`)}
                  >
                    Ver Apólice
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary">Informação não disponível</Typography>
              )}
            </CardContent>
          </Card>

          {claim.asset && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Bem Segurado</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1">{claim.asset.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {claim.asset.type}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Histórico</Typography>
              <Divider sx={{ mb: 2 }} />
              <Timeline sx={{ p: 0 }}>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2">Sinistro registrado</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(claim.createdAt)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                {claim.status !== ClaimStatus.PENDING && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="info" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">Em análise</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status alterado
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
                {(claim.status === ClaimStatus.APPROVED || claim.status === ClaimStatus.REJECTED) && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color={claim.status === ClaimStatus.APPROVED ? 'success' : 'error'} />
                      {claim.status === ClaimStatus.SETTLED && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">
                        {claim.status === ClaimStatus.APPROVED ? 'Aprovado' : 'Rejeitado'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Decisão finalizada
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
                {claim.status === ClaimStatus.SETTLED && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="default" />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">Liquidado</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pagamento realizado
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o sinistro #${claim.claimNumber}? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Excluir"
        confirmColor="error"
      />

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Alterar Status do Sinistro</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Novo Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ClaimStatus)}
            sx={{ mb: 2, mt: 1 }}
          >
            {Object.entries(claimStatusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observações"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            placeholder="Motivo da alteração de status..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleStatusChange}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Documento ampliado"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClaimDetails;
