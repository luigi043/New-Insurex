import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Chip, Tooltip, CircularProgress, Alert } from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { useNotification } from '../../hooks/useNotification';

// Mock data for partners
const mockPartners = [
  { id: '1', companyName: 'ABC Insurance Brokers', type: 'broker', status: 'active', commissionRate: 10, contactPerson: 'John Doe', contactEmail: 'john@abc.com', totalPolicies: 45 },
  { id: '2', companyName: 'XYZ Agents Ltd', type: 'agent', status: 'active', commissionRate: 8, contactPerson: 'Jane Smith', contactEmail: 'jane@xyz.com', totalPolicies: 32 },
];

export const PartnerList: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading] = useState(false);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
      case 'terminated': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Partners</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/partners/new')}>New Partner</Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Commission</TableCell>
                <TableCell align="right">Policies</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (<TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>) :
               mockPartners.length === 0 ? (<TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><Typography color="textSecondary">No partners found</Typography></TableCell></TableRow>) :
               (mockPartners.map((partner) => (
                <TableRow key={partner.id} hover>
                  <TableCell>{partner.companyName}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{partner.type}</TableCell>
                  <TableCell>{partner.contactPerson}<br/><Typography variant="caption" color="textSecondary">{partner.contactEmail}</Typography></TableCell>
                  <TableCell><Chip label={partner.status.toUpperCase()} color={getStatusColor(partner.status)} size="small" /></TableCell>
                  <TableCell align="right">{partner.commissionRate}%</TableCell>
                  <TableCell align="right">{partner.totalPolicies}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View"><IconButton size="small" onClick={() => navigate(`/partners/${partner.id}`)}><Visibility /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => navigate(`/partners/edit/${partner.id}`)}><Edit /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={mockPartners.length} page={page} onPageChange={handleChangePage}
          rowsPerPage={pageSize} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
      </Paper>
    </Box>
  );
};
