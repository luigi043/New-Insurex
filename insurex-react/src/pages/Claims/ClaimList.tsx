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
  CardContent
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Refresh,
  FilterList,
  Warning,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';
import { useClaims } from '../../hooks/useClaims';
import { ClaimStatus } from '../../types/claim.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/Common/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';

const claimStatuses = [
  { value: '', label: 'Todos' },
  { value: ClaimStatus.PENDING, label: 'Pendente' },
  { value: ClaimStatus.UNDER_REVIEW, label: 'Em Análise' },
  { value: ClaimStatus.APPROVED, label: 'Aprovado' },
  { value: ClaimStatus.REJECTED, label: 'Rejeitado' },
  { value: ClaimStatus.SETTLED, label: 'Liquidado' }
];

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

export const ClaimList: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { claims, loading, error, fetchClaims, deleteClaim, totalClaims } = useClaims();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [claimToDelete, setClaimToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadClaims();
  }, [page, rowsPerPage, statusFilter]);

  const loadClaims = async () => {
    try {
      await fetchClaims({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter || undefined,
        search: searchTerm || undefined
      });
    } catch (err) {
      showError('Erro ao carregar sinistros');
    }
  };

  const handleSearch = () => {
    setPage(0);
    loadClaims();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(0);
    loadClaims();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id: string) => {
    setClaimToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (claimToDelete) {
      try {
        await deleteClaim(claimToDelete);
        showSuccess('Sinistro excluído com sucesso!');
        loadClaims();
      } catch (err) {
        showError('Erro ao excluir sinistro');
      }
    }
    setDeleteDialogOpen(false);
    setClaimToDelete(null);
  };

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.APPROVED:
        return <CheckCircle fontSize="small" />;
      case ClaimStatus.REJECTED:
        return <Cancel fontSize="small" />;
      case ClaimStatus.PENDING:
        return <Pending fontSize="small" />;
      default:
        return <Warning fontSize="small" />;
    }
  };

  const pendingClaims = claims.filter(c => c.status === ClaimStatus.PENDING).length;
  const approvedClaims = claims.filter(c => c.status === ClaimStatus.APPROVED).length;
  const totalClaimed = claims.reduce((sum, c) => sum + (c.claimedAmount || 0), 0);

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Sinistros</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/claims/new')}
        >
          Novo Sinistro
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Pendentes</Typography>
              <Typography variant="h4" color="warning.main">{pendingClaims}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Aprovados</Typography>
              <Typography variant="h4" color="success.main">{approvedClaims}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Total Reivindicado</Typography>
              <Typography variant="h4" color="primary.main">{formatCurrency(totalClaimed)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar sinistro..."
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
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | '')}
            >
              {claimStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
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
              <TableCell>Número</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Apólice</TableCell>
              <TableCell>Data do Ocorrido</TableCell>
              <TableCell>Valor Reivindicado</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : claims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    Nenhum sinistro encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              claims.map((claim) => (
                <TableRow key={claim.id} hover>
                  <TableCell>{claim.claimNumber}</TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ maxWidth: 200 }}>
                      {claim.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{claim.policy?.policyNumber || 'N/A'}</TableCell>
                  <TableCell>{formatDate(claim.incidentDate)}</TableCell>
                  <TableCell>{formatCurrency(claim.claimedAmount)}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(claim.status)}
                      label={claimStatusLabels[claim.status]}
                      color={claimStatusColors[claim.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/claims/${claim.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/claims/edit/${claim.id}`)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(claim.id)}
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
          count={totalClaims}
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
        message="Tem certeza que deseja excluir este sinistro? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Excluir"
        confirmColor="error"
      />
    </Box>
  );
};

export default ClaimList;
