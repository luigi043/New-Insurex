import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Typography, IconButton } from '@mui/material';
import { Add, Visibility, Edit, Delete } from '@mui/icons-material';
import { policyService } from '../services/policy.service';
import { Policy } from '../types/policy.types';

export const PolicyList: React.FC = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => { loadPolicies(); }, []);

  const loadPolicies = async () => {
    const data = await policyService.getPolicies();
    setPolicies(data.items);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this policy?')) {
      await policyService.deletePolicy(id);
      loadPolicies();
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Policies</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/policies/new')}>New Policy</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Policy #</TableCell><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell>Premium</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.policyNumber}</TableCell><TableCell>{p.name}</TableCell><TableCell>{p.type}</TableCell>
                <TableCell>${p.premium}</TableCell>
                <TableCell><Chip label={p.status} color={p.status === 'Active' ? 'success' : 'default'} size="small" /></TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/policies/${p.id}`)}><Visibility /></IconButton>
                  <IconButton size="small" onClick={() => navigate(`/policies/edit/${p.id}`)}><Edit /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
