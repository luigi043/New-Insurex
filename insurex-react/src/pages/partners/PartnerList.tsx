import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Tooltip,
  CircularProgress,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Refresh,
  FilterList,
  Business,
  Email,
  Phone,
  Person
} from '@mui/icons-material';
import { usePartners } from '../../hooks/usePartners';
import { PartnerType, PartnerStatus } from '../../types/partner.types';
import { formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const partnerTypes = [
  { value: '', label: 'Todos' },
  { value: PartnerType.BROKER, label: 'Corretor' },
  { value: PartnerType.AGENCY, label: 'Agência' },
  { value: PartnerType.ADJUSTER, label: 'Ajustador' },
  { value: PartnerType.REPAIR_SHOP, label: 'Oficina' },
  { value: PartnerType.OTHER, label: 'Outro' }
];

const partnerStatusColors: Record<PartnerStatus, 'success' | 'error' | 'warning' | 'default'> = {
  [PartnerStatus.ACTIVE]: 'success',
  [PartnerStatus.INACTIVE]: 'error',
  [PartnerStatus.SUSPENDED]: 'warning',
  [PartnerStatus.PENDING]: 'default'
};

const partnerStatusLabels: Record<PartnerStatus, string> = {
  [PartnerStatus.ACTIVE]: 'Ativo',
  [PartnerStatus.INACTIVE]: 'Inativo',
  [PartnerStatus.SUSPENDED]: 'Suspenso',
  [PartnerStatus.PENDING]: 'Pendente'
};

const partnerTypeLabels: Record<PartnerType, string> = {
  [PartnerType.BROKER]: 'Corretor',
  [PartnerType.AGENCY]: 'Agência',
  [PartnerType.ADJUSTER]: 'Ajustador',
  [PartnerType.REPAIR_SHOP]: 'Oficina',
  [PartnerType.OTHER]: 'Outro'
};

export const PartnerList: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { partners, loading, error, fetchPartners, deletePartner, totalPartners } = usePartners();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<PartnerType | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadPartners();
  }, [page, rowsPerPage, typeFilter]);

  const loadPartners = async () => {
    try {
      await fetchPartners({
        page: page + 1,
        limit: rowsPerPage,
        type: typeFilter || undefined,
        search: searchTerm || undefined
      });
    } catch (err) {
      showError('Erro ao carregar parceiros');
    }
  };

  const handleSearch = () => {
    setPage(0);
    loadPartners();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setPage(0);
    loadPartners();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id: string) => {
    setPartnerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (partnerToDelete) {
      try {
        await deletePartner(partnerToDelete);
        showSuccess('Parceiro excluído com sucesso!');
        loadPartners();
      } catch (err) {
        showError('Erro ao excluir parceiro');
      }
    }
    setDeleteDialogOpen(false);
    setPartnerToDelete(null);
  };

  const activePartners = partners.filter(p => p.status === PartnerStatus.ACTIVE).length;
  const pendingPartners = partners.filter(p => p.status === PartnerStatus.PENDING).length;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Parceiros</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/partners/new')}
        >
          Novo Parceiro
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Total de Parceiros</Typography>
              <Typography variant="h4">{totalPartners}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Parceiros Ativos</Typography>
              <Typography variant="h4" color="success.main">{activePartners}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Pendentes</Typography>
              <Typography variant="h4" color="warning.main">{pendingPartners}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar parceiro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Tipo"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PartnerType | '')}
            >
              {partnerTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSearch} startIcon={<FilterList />}>
              Filtrar
            </Button>
            <Button variant="outlined" onClick={handleClearFilters} startIcon={<Refresh />}>
              Limpar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parceiro</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Desde</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : partners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    Nenhum parceiro encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              partners.map((partner) => (
                <TableRow key={partner.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {partner.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{partner.name}</Typography>
                        {partner.document && (
                          <Typography variant="caption" color="text.secondary">
                            {partner.document}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{partnerTypeLabels[partner.type]}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Email fontSize="small" color="action" />
                        {partner.email}
                      </Typography>
                      {partner.phone && (
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone fontSize="small" color="action" />
                          {partner.phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={partnerStatusLabels[partner.status]}
                      color={partnerStatusColors[partner.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(partner.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/partners/${partner.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/partners/edit/${partner.id}`)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(partner.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalPartners}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Itens por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este parceiro? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Excluir"
        confirmColor="error"
      />
    </Box>
  );
};

export default PartnerList;
