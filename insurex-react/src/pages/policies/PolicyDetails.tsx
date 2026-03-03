import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Chip, Button, Divider, List, ListItem, ListItemText,
  CircularProgress, Alert, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { Edit, Delete, ArrowBack, Autorenew, Cancel, PlayArrow, Pause, History, Description, Info } from '@mui/icons-material';
import { Policy, PolicyStatus } from '../../types/policy.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { usePolicies } from '../../hooks/usePolicies';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { PolicyHistoryTimeline } from '../../components/Policies/PolicyHistoryTimeline';
import { PolicyRenewalModal } from '../../components/Policies/PolicyRenewalModal';
import { PolicyDocumentViewer } from '../../components/Policies/PolicyDocumentViewer';
import { Tab, Tabs } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`policy-tabpanel-${index}`}
      aria-labelledby={`policy-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const PolicyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const {
    getPolicy,
    deletePolicy,
    cancelPolicy,
    approvePolicy,
    suspendPolicy,
    isLoading,
    error: hookError
  } = usePolicies({ autoFetch: false });

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (id) fetchPolicyData(id);
  }, [id]);

  const fetchPolicyData = async (policyId: string) => {
    setLocalLoading(true);
    try {
      const data = await getPolicy(policyId);
      setPolicy(data);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to fetch policy details');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePolicy(id);
      showNotification('success', 'Apólice excluída com sucesso');
      navigate('/policies');
    } catch (err: any) {
      showNotification('error', err.message || 'Erro ao excluir apólice');
    }
  };

  const handleCancelAction = async () => {
    if (!id) return;
    try {
      await cancelPolicy(id, cancelReason);
      showNotification('success', 'Apólice cancelada com sucesso');
      setCancelDialogOpen(false);
      fetchPolicyData(id);
    } catch (err: any) {
      showNotification('error', err.message || 'Erro ao cancelar apólice');
    }
  };

  const handleApproveAction = async () => {
    if (!id) return;
    try {
      await approvePolicy(id);
      showNotification('success', 'Apólice aprovada com sucesso');
      fetchPolicyData(id);
    } catch (err: any) {
      showNotification('error', err.message || 'Erro ao aprovar apólice');
    }
  };

  const handleSuspendAction = async () => {
    if (!id) return;
    try {
      await suspendPolicy(id, 'Suspensa pelo usuário');
      showNotification('success', 'Apólice suspensa com sucesso');
      fetchPolicyData(id);
    } catch (err: any) {
      showNotification('error', err.message || 'Erro ao suspender apólice');
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: PolicyStatus) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'PENDING':
      case 'DRAFT': return 'warning';
      case 'EXPIRED':
      case 'CANCELLED': return 'error';
      case 'SUSPENDED': return 'default';
      default: return 'default';
    }
  };

  if (localLoading || isLoading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>);
  if (localError || hookError || !policy) return (<Alert severity="error" sx={{ mb: 2 }}>{localError || hookError || 'Apólice não encontrada'}</Alert>);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/policies')}>Voltar</Button>
          <Typography variant="h4">Detalhes da Apólice</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {(policy.status.toUpperCase() === 'PENDING' || policy.status.toUpperCase() === 'DRAFT') && (
            <Button variant="contained" color="success" startIcon={<PlayArrow />} onClick={handleApproveAction}>Aprovar</Button>
          )}
          {policy.status.toUpperCase() === 'ACTIVE' && (
            <Button variant="outlined" color="warning" startIcon={<Pause />} onClick={handleSuspendAction}>Suspender</Button>
          )}
          {(policy.status.toUpperCase() === 'ACTIVE' || policy.status.toUpperCase() === 'SUSPENDED') && (
            <Button variant="outlined" startIcon={<Autorenew />} onClick={() => setRenewDialogOpen(true)}>Renovar</Button>
          )}
          {['ACTIVE', 'SUSPENDED', 'PENDING'].includes(policy.status.toUpperCase()) && (
            <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => setCancelDialogOpen(true)}>Cancelar</Button>
          )}
          <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/policies/edit/${id}`)}>Editar</Button>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setDeleteDialogOpen(true)}>Excluir</Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Info />} label="Informações" />
          <Tab icon={<Description />} label="Documentos" />
          <Tab icon={<History />} label="Histórico" />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h5" gutterBottom>{policy.policyNumber}</Typography>
                  <Chip label={policy.status.toUpperCase()} color={getStatusColor(policy.status)} />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Tipo de Apólice</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{policy.type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Titular</Typography>
                  <Typography variant="body1">{policy.holderName}</Typography>
                  <Typography variant="body2" color="textSecondary">{policy.holderEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Data de Início</Typography>
                  <Typography variant="body1">{formatDate(policy.startDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Data de Término</Typography>
                  <Typography variant="body1">{formatDate(policy.endDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Prêmio</Typography>
                  <Typography variant="body1">{formatCurrency(policy.premium)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Valor Segurado</Typography>
                  <Typography variant="body1">{formatCurrency(policy.insuredAmount)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Franquia</Typography>
                  <Typography variant="body1">{formatCurrency(policy.deductible || 0)}</Typography>
                </Grid>
              </Grid>
              {policy.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>Notas</Typography>
                  <Typography variant="body1">{policy.notes}</Typography>
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Resumo</Typography>
                <List dense>
                  <ListItem><ListItemText primary="Prêmio Total" secondary={formatCurrency(policy.premium)} /></ListItem>
                  <ListItem><ListItemText primary="Cobertura Total" secondary={formatCurrency(policy.insuredAmount)} /></ListItem>
                  <ListItem><ListItemText primary="Criado em" secondary={formatDate(policy.createdAt)} /></ListItem>
                  <ListItem><ListItemText primary="Última Atualização" secondary={formatDate(policy.updatedAt)} /></ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Paper sx={{ p: 3 }}>
          <PolicyDocumentViewer
            policy={policy}
            onUpload={() => showNotification('info', 'Funcionalidade de upload em desenvolvimento')}
            onDelete={(docId) => showNotification('success', `Documento ${docId} excluído`)}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Histórico de Atividades</Typography>
          <PolicyHistoryTimeline policyId={policy.id} />
        </Paper>
      </TabPanel>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir Apólice"
        message="Tem certeza que deseja excluir esta apólice? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancelar Apólice</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo do Cancelamento"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Sair</Button>
          <Button onClick={handleCancelAction} color="error" variant="contained">Confirmar Cancelamento</Button>
        </DialogActions>
      </Dialog>

      {renewDialogOpen && (
        <PolicyRenewalModal
          open={renewDialogOpen}
          onClose={() => setRenewDialogOpen(false)}
          policy={policy}
          onSuccess={() => {
            showNotification('success', 'Apólice renovada com sucesso');
            fetchPolicyData(policy.id);
          }}
        />
      )}
    </Box>
  );
};

export default PolicyDetails;
