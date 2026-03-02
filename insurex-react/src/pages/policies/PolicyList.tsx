import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box, Chip 
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { policyService } from '../services/policy.service';

export const PolicyList: React.FC = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const response = await policyService.getPolicies();
      setPolicies(response.data.items);
    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Policies</Typography>
        <Button variant="contained" startIcon={<Add />}>
          New Policy
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Policy #</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Premium</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy: any) => (
              <TableRow key={policy.id}>
                <TableCell>{policy.policyNumber}</TableCell>
                <TableCell>{policy.client?.firstName} {policy.client?.lastName}</TableCell>
                <TableCell>{policy.type}</TableCell>
                <TableCell>${policy.premium}</TableCell>
                <TableCell>
                  <Chip label={policy.status} color="primary" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
