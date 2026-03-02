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
  ListItemIcon,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Edit,
  ArrowBack,
  Delete,
  LocationOn,
  CalendarToday,
  AttachMoney,
  ConfirmationNumber,
  Business,
  Inventory,
  Description,
  Image as ImageIcon,
  Warning
} from '@mui/icons-material';
import { useAssets } from '../../hooks/useAssets';
import { AssetStatus, AssetType } from '../../types/asset.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const assetTypeLabels: Record<AssetType, string> = {
  [AssetType.VEHICLE]: 'Veículo',
  [AssetType.PROPERTY]: 'Imóvel',
  [AssetType.EQUIPMENT]: 'Equipamento',
  [AssetType.OTHER]: 'Outro'
};

const assetStatusColors: Record<AssetStatus, 'success' | 'error' | 'warning' | 'default'> = {
  [AssetStatus.ACTIVE]: 'success',
  [AssetStatus.INACTIVE]: 'error',
  [AssetStatus.UNDER_MAINTENANCE]: 'warning',
  [AssetStatus.DISPOSED]: 'default'
};

const assetStatusLabels: Record<AssetStatus, string> = {
  [AssetStatus.ACTIVE]: 'Ativo',
  [AssetStatus.INACTIVE]: 'Inativo',
  [AssetStatus.UNDER_MAINTENANCE]: 'Em Manutenção',
  [AssetStatus.DISPOSED]: 'Descartado'
};

export const AssetDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useNotification();
  
  const { getAssetById, deleteAsset, loading, error } = useAssets();
  const [asset, setAsset] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAsset(id);
    }
  }, [id]);

  const loadAsset = async (assetId: string) => {
    try {
      const data = await getAssetById(assetId);
      setAsset(data);
    } catch (err) {
      showError('Erro ao carregar detalhes do bem');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteAsset(id);
      showSuccess('Bem excluído com sucesso!');
      navigate('/assets');
    } catch (err) {
      showError('Erro ao excluir bem');
    }
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setImageDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !asset) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/assets')} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">
          {error || 'Bem não encontrado'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/assets')}>
            Voltar
          </Button>
          <Typography variant="h4">{asset.name}</Typography>
          <Chip
            label={assetStatusLabels[asset.status]}
            color={assetStatusColors[asset.status]}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/assets/edit/${id}`)}
          >
            Editar
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

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory />
              Informações Gerais
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Tipo</Typography>
                <Typography>{assetTypeLabels[asset.type]}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Valor</Typography>
                <Typography variant="h6" color="primary">{formatCurrency(asset.value)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Descrição</Typography>
                <Typography>{asset.description || 'Nenhuma descrição disponível'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Data de Aquisição</Typography>
                <Typography>{formatDate(asset.purchaseDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Data de Cadastro</Typography>
                <Typography>{formatDate(asset.createdAt)}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business />
              Detalhes Técnicos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Fabricante</Typography>
                <Typography>{asset.manufacturer || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Modelo</Typography>
                <Typography>{asset.model || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Ano</Typography>
                <Typography>{asset.year || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Número de Série</Typography>
                <Typography>{asset.serialNumber || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Localização</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" color="action" />
                  {asset.location || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {asset.documents && asset.documents.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description />
                Documentos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ImageList cols={3} gap={8}>
                {asset.documents.map((doc: any, index: number) => (
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

        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConfirmationNumber />
                Apólice Vinculada
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {asset.policy ? (
                <Box>
                  <Typography variant="subtitle1">{asset.policy.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nº: {asset.policy.policyNumber}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/policies/${asset.policyId}`)}
                  >
                    Ver Apólice
                  </Button>
                </Box>
              ) : (
                <Typography color="text.secondary">
                  Nenhuma apólice vinculada
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning />
                Histórico de Sinistros
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {asset.claims && asset.claims.length > 0 ? (
                <List dense>
                  {asset.claims.map((claim: any) => (
                    <ListItem
                      key={claim.id}
                      button
                      onClick={() => navigate(`/claims/${claim.id}`)}
                    >
                      <ListItemIcon>
                        <Warning color={claim.status === 'APPROVED' ? 'success' : 'warning'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={claim.description}
                        secondary={formatDate(claim.date)}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  Nenhum sinistro registrado
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o bem "${asset.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Excluir"
        confirmColor="error"
      />

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

export default AssetDetails;
