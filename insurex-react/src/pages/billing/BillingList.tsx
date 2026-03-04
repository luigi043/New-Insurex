import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Visibility,
  Search,
  Refresh,
  FilterList,
  Payment,
  Receipt,
  Schedule,
  PictureAsPdf
} from '@mui/icons-material';
import { useBilling } from '../../hooks/useBilling';
import { BillingStatus, BillingType, InvoiceStatus } from '../../types/billing.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import { PaymentReminderDialog } from '../../components/Billing/PaymentReminderDialog';
import { generateInvoicePDF as generatePDFUtility } from '../../utils/InvoicePDFGenerator';

const billingStatuses = [
  { value: '', label: 'Todos' },
  { value: BillingStatus.PENDING, label: 'Pendente' },
  { value: BillingStatus.PAID, label: 'Pago' },
  { value: BillingStatus.OVERDUE, label: 'Vencido' },
  { value: BillingStatus.CANCELLED, label: 'Cancelado' }
];

const billingStatusColors: Record<string, 'success' | 'error' | 'warning' | 'default' | 'info'> = {
  [BillingStatus.PENDING]: 'warning',
  [BillingStatus.PAID]: 'success',
  [BillingStatus.OVERDUE]: 'error',
  [BillingStatus.CANCELLED]: 'default',
  [BillingStatus.PARTIAL]: 'info',
  [InvoiceStatus.SENT]: 'info',
  // Deduplicated duplicates (PAID and OVERDUE are same strings)
};

const billingStatusLabels: Record<string, string> = {
  [BillingStatus.PENDING]: 'Pendente',
  [BillingStatus.PAID]: 'Pago',
  [BillingStatus.OVERDUE]: 'Vencido',
  [BillingStatus.CANCELLED]: 'Cancelado',
  [BillingStatus.PARTIAL]: 'Parcial',
  [InvoiceStatus.SENT]: 'Enviado',
  [InvoiceStatus.DRAFT]: 'Rascunho'
  // Deduplicated PAID and OVERDUE
};

const billingTypeLabels: Record<string, string> = {
  [BillingType.PREMIUM]: 'Prêmio',
  [BillingType.COMMISSION]: 'Comissão',
  [BillingType.FEE]: 'Taxa',
  [BillingType.REFUND]: 'Reembolso',
  [BillingType.OTHER]: 'Outro'
};

export const BillingList: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { billings, loading, error, fetchBillings, totalBillings, generateInvoice } = useBilling();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<any>('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<any>(null);

  useEffect(() => {
    loadBillings();
  }, [page, rowsPerPage, statusFilter]);

  const loadBillings = async () => {
    try {
      await fetchBillings({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      }, page + 1, rowsPerPage);
    } catch (err) {
      showNotification('error', 'Erro ao carregar faturas');
    }
  };

  const handleSearch = () => {
    setPage(0);
    loadBillings();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(0);
    loadBillings();
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGenerateInvoice = async (billingId: string) => {
    try {
      await generateInvoice(billingId);
      showNotification('success', 'Fatura gerada com sucesso!');
    } catch (err) {
      showNotification('error', 'Erro ao gerar fatura');
    }
  };

  const openPaymentDialog = (billing: any) => {
    setSelectedBilling(billing);
    setPaymentDialogOpen(true);
  };

  const openReminderDialog = (billing: any) => {
    setSelectedBilling(billing);
    setReminderDialogOpen(true);
  };

  const handleClientSidePdf = (billing: any) => {
    generatePDFUtility(billing);
    showNotification('success', 'PDF gerado localmente com sucesso!');
  };

  const pendingAmount = billings
    .filter(b => b.status === BillingStatus.PENDING || (b.status as string) === InvoiceStatus.OVERDUE)
    .reduce((sum, b) => sum + b.amount, 0);

  const paidAmount = billings
    .filter(b => b.status === BillingStatus.PAID || (b.status as string) === InvoiceStatus.PAID)
    .reduce((sum, b) => sum + b.amount, 0);

  const overdueCount = billings.filter(b => (b.status as string) === BillingStatus.OVERDUE || (b.status as string) === InvoiceStatus.OVERDUE).length;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Faturamento</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">A Receber</Typography>
              <Typography variant="h4" color="warning.main">{formatCurrency(pendingAmount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Recebido</Typography>
              <Typography variant="h4" color="success.main">{formatCurrency(paidAmount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Vencidos</Typography>
              <Typography variant="h4" color="error.main">{overdueCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar fatura..."
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
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {billingStatuses.map((status) => (
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
              <TableCell>Tipo</TableCell>
              <TableCell>Referência</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Valor</TableCell>
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
            ) : billings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    Nenhuma fatura encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              billings.map((billing: any) => (
                <TableRow key={billing.id} hover>
                  <TableCell>{billing.invoiceNumber}</TableCell>
                  <TableCell>{billingTypeLabels[billing.type] || billing.type}</TableCell>
                  <TableCell>
                    {billing.policyNumber || billing.claimNumber || 'N/A'}
                  </TableCell>
                  <TableCell>{formatDate(billing.dueDate)}</TableCell>
                  <TableCell>{formatCurrency(billing.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      label={billingStatusLabels[billing.status] || billing.status}
                      color={billingStatusColors[billing.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/billing/${billing.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gerar PDF (Servidor)">
                      <IconButton
                        size="small"
                        onClick={() => handleGenerateInvoice(billing.id)}
                      >
                        <PictureAsPdf />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gerar PDF (Local)">
                      <IconButton
                        size="small"
                        onClick={() => handleClientSidePdf(billing)}
                      >
                        <Receipt />
                      </IconButton>
                    </Tooltip>
                    {(billing.status === BillingStatus.PENDING || billing.status === (InvoiceStatus.SENT as any)) && (
                      <Tooltip title="Registrar Pagamento">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => openPaymentDialog(billing)}
                        >
                          <Payment />
                        </IconButton>
                      </Tooltip>
                    )}
                    {(billing.status === BillingStatus.OVERDUE || billing.status === (InvoiceStatus.OVERDUE as any)) && (
                      <Tooltip title="Enviar Lembrete">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => openReminderDialog(billing)}
                        >
                          <Schedule />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalBillings}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Itens por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Pagamento</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Fatura: {selectedBilling?.invoiceNumber}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Valor: {formatCurrency(selectedBilling?.amount || 0)}
          </Typography>
          <TextField
            fullWidth
            type="date"
            label="Data do Pagamento"
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Método de Pagamento"
            select
            sx={{ mt: 2 }}
            defaultValue=""
          >
            <MenuItem value="CREDIT_CARD">Cartão de Crédito</MenuItem>
            <MenuItem value="DEBIT_CARD">Cartão de Débito</MenuItem>
            <MenuItem value="BANK_TRANSFER">Transferência Bancária</MenuItem>
            <MenuItem value="BOLETO">Boleto</MenuItem>
            <MenuItem value="CASH">Dinheiro</MenuItem>
            <MenuItem value="PIX">PIX</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Observações"
            multiline
            rows={2}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="success">
            Confirmar Pagamento
          </Button>
        </DialogActions>
      </Dialog>

      <PaymentReminderDialog
        open={reminderDialogOpen}
        onClose={() => setReminderDialogOpen(false)}
        invoice={selectedBilling}
      />
    </Box>
  );
};

export default BillingList;
