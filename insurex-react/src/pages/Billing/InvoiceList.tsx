import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent } from '@mui/material';
import { billingService } from '../services/billing.service';
import { InvoiceStatus } from '../types/billing.types';

export const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    billingService.getInvoices(1, 10, statusFilter || undefined).then(r => setInvoices(r.items));
  }, [statusFilter]);

  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Invoices</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}><Card><CardContent><Typography color="textSecondary">Total</Typography><Typography variant="h5">{stats.total}</Typography></CardContent></Card></Grid>
        <Grid item xs={4}><Card><CardContent><Typography color="textSecondary">Total Amount</Typography><Typography variant="h5">${stats.totalAmount.toLocaleString()}</Typography></CardContent></Card></Grid>
        <Grid item xs={4}><Card><CardContent><Typography color="textSecondary">Paid</Typography><Typography variant="h5" color="success.main">${stats.paid.toLocaleString()}</Typography></CardContent></Card></Grid>
      </Grid>
      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl fullWidth size="small"><InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {Object.values(InvoiceStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>
      <TableContainer component={Paper}>
        <Table><TableHead><TableRow><TableCell>Invoice #</TableCell><TableCell>Client</TableCell><TableCell>Due Date</TableCell><TableCell>Amount</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
        <TableBody>{invoices.map(i => (
          <TableRow key={i.id}>
            <TableCell>{i.invoiceNumber}</TableCell><TableCell>{i.clientName}</TableCell><TableCell>{new Date(i.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>${i.amount.toLocaleString()}</TableCell>
            <TableCell><Chip label={i.status} color={i.status === 'Paid' ? 'success' : i.status === 'Overdue' ? 'error' : 'default'} size="small" /></TableCell>
          </TableRow>
        ))}</TableBody></Table>
      </TableContainer>
    </Box>
  );
};
