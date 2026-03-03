import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


import { InvestigationNotes } from '../../components/Claims/InvestigationNotes';
import { ClaimPaymentModal } from '../../components/Claims/ClaimPaymentModal';
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
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Edit,
  ArrowBack,
  Delete,
  LocationOn,
  Description,
} from '@mui/icons-material';
import { useClaims } from '../../hooks/useClaims';
import { ClaimStatus, ClaimType } from '../../types/claim.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const claimTypeLabels: Record<ClaimType, string> = {
  [ClaimType.ACCIDENT]: 'Acidente',
  [ClaimType.THEFT]: 'Roubo/Furto',
  [ClaimType.FIRE]: 'Incêndio',
  [ClaimType.NATURAL_DISASTER]: 'Desastre Natural',
  [ClaimType.LIABILITY]: 'Responsabilidade Civil',
  [ClaimType.MEDICAL]: 'Médico/Saúde',
  [ClaimType.DEATH]: 'Óbito',
  [ClaimType.DISABILITY]: 'Invalidez',
  [ClaimType.PROPERTY_DAMAGE]: 'Danos Materiais',
  [ClaimType.OTHER]: 'Outro'
};

const claimStatusColors: Record<ClaimStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  [ClaimStatus.DRAFT]: 'default',
  [ClaimStatus.SUBMITTED]: 'warning',
  [ClaimStatus.UNDER_REVIEW]: 'info',
  [ClaimStatus.PENDING_INFO]: 'warning',
  [ClaimStatus.APPROVED]: 'success',
  [ClaimStatus.PARTIALLY_APPROVED]: 'info',
  [ClaimStatus.REJECTED]: 'error',
  [ClaimStatus.SETTLED]: 'success',
  [ClaimStatus.CLOSED]: 'default',
  [ClaimStatus.APPEALED]: 'warning'
};

const claimStatusLabels: Record<ClaimStatus, string> = {
  [ClaimStatus.DRAFT]: 'Rascunho',
  [ClaimStatus.SUBMITTED]: 'Enviado',
  [ClaimStatus.UNDER_REVIEW]: 'Em Análise',
  [ClaimStatus.PENDING_INFO]: 'Pendente de Infos',
  [ClaimStatus.APPROVED]: 'Aprovado',
  [ClaimStatus.PARTIALLY_APPROVED]: 'Parcialmente Aprovado',
  [ClaimStatus.REJECTED]: 'Rejeitado',
  [ClaimStatus.SETTLED]: 'Liquidado',
  [ClaimStatus.CLOSED]: 'Fechado',
  [ClaimStatus.APPEALED]: 'Recorrido'
};

const getStatusStep = (status: ClaimStatus): number => {
  switch (status) {
    case ClaimStatus.SUBMITTED: return 0;
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
  const { showNotification } = useNotification();

  const {
    getClaim,
    deleteClaim,
    approveClaim,
    rejectClaim,
    isLoading
  } = useClaims({ autoFetch: false });

  const [claim, setClaim] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (id) {
      loadClaim(id);
    }
  }, [id]);

  const loadClaim = async (claimId: string) => {
    setLocalLoading(true);
    try {
      const data = await getClaim(claimId);
      setClaim(data);
      setApprovedAmount(data.claimedAmount);
    } catch (err) {
      showNotification('error', 'Erro ao carregar detalhes do sinistro');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteClaim(id);
      showNotification('success', 'Sinistro excluído com sucesso!');
      navigate('/claims');
    } catch (err) {
      showNotification('error', 'Erro ao excluir sinistro');
    }
  };

  const handleApproveAction = async () => {
    if (!id) return;
    try {
      await approveClaim(id, approvedAmount, statusNotes);
      showNotification('success', 'Sinistro aprovado com sucesso!');
      setApproveDialogOpen(false);
      loadClaim(id);
    } catch (err) {
      showNotification('error', 'Erro ao aprovar sinistro');
    }
  };

  const handleRejectAction = async () => {
    if (!id) return;
    try {
      await rejectClaim(id, rejectReason);
      showNotification('success', 'Sinistro rejeitado');
      setRejectDialogOpen(false);
      loadClaim(id);
    } catch (err) {
      showNotification('error', 'Erro ao rejeitar sinistro');
    }
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setImageDialogOpen(true);
  };

  if (localLoading || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!claim) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/claims')} sx={{ mb: 2 }}>
          Voltar
        </Button>
        {isLoading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Salvando...
          </Alert>
        )}
        <Alert severity="error">
          Sinistro não encontrado
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
          {claim.status === ClaimStatus.SUBMITTED && (
            <Button variant="contained" color="primary" onClick={() => setApproveDialogOpen(true)}>
              Aprovar
            </Button>
          )}
          {claim.status === ClaimStatus.SUBMITTED && (
            <Button variant="outlined" color="error" onClick={() => setRejectDialogOpen(true)}>
              Rejeitar
            </Button>
          )}
          {claim.status === ClaimStatus.APPROVED && (
            <Button variant="contained" color="success" onClick={() => setPaymentDialogOpen(true)}>
              Pagar
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={() => navigate(`/policies/${claim.policyId}`)}
          >
            Status
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
            <Step key={index} completed={index < currentStep}>
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
                label={claimStatusLabels[claim.status as ClaimStatus] || claim.status}
                color={claimStatusColors[claim.status as ClaimStatus] || 'default'}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                <Typography>{claimTypeLabels[claim.type as ClaimType] || claim.type}</Typography>
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
              {claim.status === ClaimStatus.SUBMITTED && (
                <Timeline sx={{ p: 0 }}>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">Sinistro enviado</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(claim.createdAt)}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              )}
              {claim.status !== ClaimStatus.DRAFT && claim.status !== ClaimStatus.SUBMITTED && (
                <Timeline sx={{ p: 0 }}>
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
                        <TimelineDot color="success" />
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
              )}
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

      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Aprovar Sinistro</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>Defina o valor aprovado para o pagamento.</Typography>
          <TextField
            fullWidth
            label="Valor Aprovado"
            type="number"
            value={approvedAmount}
            onChange={(e) => setApprovedAmount(Number(e.target.value))}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observações"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={handleApproveAction}>
            Confirmar Aprovação
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rejeitar Sinistro</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Motivo da Rejeição"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleRejectAction}>
            Confirmar Rejeição
          </Button>
        </DialogActions>
      </Dialog>

      {
        paymentDialogOpen && (
          <ClaimPaymentModal
            open={paymentDialogOpen}
            onClose={() => setPaymentDialogOpen(false)}
            claim={claim}
            onSuccess={() => {
              showNotification('success', 'Pagamento processado com sucesso');
              loadClaim(claim.id);
            }}
          />
        )
      }

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
    </Box >
  );
};

export default ClaimDetails;
