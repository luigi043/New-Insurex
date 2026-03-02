import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import { Visibility, GetApp } from '@mui/icons-material';
import { claimService } from '../../services/claim.service';

export const ClaimsList: React.FC = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadClaims();
  }, [page, pageSize]);

  const loadClaims = async () => {
    setLoading(true);
    try {
      const response = await claimService.getClaims(page + 1, pageSize);
      setClaims(response.data.items);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('Failed to load claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'info';
      case 'UnderReview': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Paid': return 'success';
      default: return 'default';
    }
  };

  const handleExport = async () => {
    try {
      const response = await claimService.exportClaims();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'claims_export.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Claims</Typography>
        <Button
          variant="contained"
          startIcon={<GetApp />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Claim Number</TableCell>
              <TableCell>Policy</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Incident Date</TableCell>
              <TableCell>Claimed Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.map((claim: any) => (
              <TableRow key={claim.id}>
                <TableCell>{claim.claimNumber}</TableCell>
                <TableCell>{claim.policy?.policyNumber}</TableCell>
                <TableCell>
                  {claim.client?.firstName} {claim.client?.lastName}
                </TableCell>
                <TableCell>{new Date(claim.incidentDate).toLocaleDateString()}</TableCell>
                <TableCell>${claim.claimedAmount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={claim.status}
                    color={getStatusColor(claim.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};