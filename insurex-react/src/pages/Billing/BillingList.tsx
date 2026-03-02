import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Chip, Tooltip, CircularProgress } from '@mui/material';
import { Visibility, Receipt } from '@mui/icons-material';

// Mock data for invoices
const mockInvoices = [
  { id: '1', invoiceNumber: 'INV-001', customerName: 'John Doe', type: 'premium', status: 'paid', issueDate: '2024-01-15', dueDate: '2024-02-15', totalAmount: 1200, currency: 'USD' },
  { id: '2', invoiceNumber: 'INV-002', customerName: 'Jane Smith', type: 'premium', status: 'pending', issueDate: '2024-01-20', dueDate: '2024-02-20', totalAmount: 850, currency: 'USD' },
];

export const BillingList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': case 'sent': return 'warning';
      case 'overdue': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Billing & Invoices</Typography>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockInvoices.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><Typography color="textSecondary">No invoices found</Typography></TableCell></TableRow>
              ) : (
                mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{invoice.type}</TableCell>
                    <TableCell><Chip label={invoice.status.toUpperCase()} color={getStatusColor(invoice.status)} size="small" /></TableCell>
                    <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell align="right">{formatCurrency(invoice.totalAmount, invoice.currency)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View"><IconButton size="small"><Visibility /></IconButton></Tooltip>
                      <Tooltip title="Download"><IconButton size="small"><Receipt /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={mockInvoices.length} page={page} onPageChange={handleChangePage}
          rowsPerPage={pageSize} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
      </Paper>
    </Box>
  );
};
