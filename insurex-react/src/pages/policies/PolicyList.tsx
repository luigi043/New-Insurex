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
  Button,
  Typography,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { policyService } from '../../services/policy.service';

export const PolicyList: React.FC = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<any[]>([]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      default: return 'default';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Policies</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/policies/new')}
        >
          New Policy
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Policy Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Premium</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>{policy.policyNumber}</TableCell>
                <TableCell>{policy.name}</TableCell>
                <TableCell>{policy.type}</TableCell>
                <TableCell>${policy.premium}</TableCell>
                <TableCell>
                  <Chip
                    label={policy.status}
                    color={getStatusColor(policy.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/policies/${policy.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
