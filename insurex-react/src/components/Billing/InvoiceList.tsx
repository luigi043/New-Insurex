import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Add, Visibility, Send, Payment, GetApp } from '@mui/icons-material';
import { billingService } from '../../services/billing.service';
import { Invoice, InvoiceStatus } from '../../types/billing.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';

export const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    loadInvoices();
  }, [page, pageSize, status]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      // My getInvoices signature is (filters?: BillingFilters, page = 1, limit = 10)
      const response = await billingService.getInvoices({ status: status as any }, page + 1, pageSize);
      setInvoices(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error: any) {
      console.error('Failed to load invoices:', error);
      showError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID: return 'success';
      case InvoiceStatus.SENT: return 'info';
      case InvoiceStatus.OVERDUE: return 'error';
      case InvoiceStatus.DRAFT: return 'default';
      default: return 'default';
    }
  };

  const handleExport = async () => {
    try {
      await billingService.exportInvoices({ status: status as any });
      showSuccess('Export started');
    } catch (error) {
      console.error('Export failed:', error);
      showError('Export failed');
    }
  };

  const handleSend = async (id: string) => {
    try {
      await billingService.sendInvoice(id);
      showSuccess('Invoice sent successfully');
      loadInvoices();
    } catch (error) {
      showError('Failed to send invoice');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Invoices</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/billing/new')}
          >
            New Invoice
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.values(InvoiceStatus).map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={9} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* Search or other filters could go here */}
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Issue Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography variant="body2" component="span">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No invoices found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.holderName}</TableCell>
                  <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">
                      {formatCurrency(invoice.totalAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={invoice.status}
                      color={getStatusColor(invoice.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => navigate(`/billing/${invoice.id}`)} title="View">
                      <Visibility fontSize="small" />
                    </IconButton>
                    {invoice.status === InvoiceStatus.DRAFT && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleSend(invoice.id)}
                        title="Send"
                      >
                        <Send fontSize="small" />
                      </IconButton>
                    )}
                    {(invoice.status === InvoiceStatus.SENT || invoice.status === InvoiceStatus.PARTIALLY_PAID) && (
                      <IconButton size="small" color="success" title="Record Payment">
                        <Payment fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setPageSize(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default InvoiceList;
