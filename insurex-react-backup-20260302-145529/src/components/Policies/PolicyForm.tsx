import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import { policyService } from '../../services/policy.service';
import { userService } from '../../services/user.service';

export const PolicyForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [insurers, setInsurers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    policyNumber: '',
    name: '',
    description: '',
    type: 'Vehicle',
    coverageAmount: '',
    premium: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Draft',
    clientId: '',
    insurerId: '',
  });

  const policyTypes = [
    'Vehicle', 'Property', 'Watercraft', 'Aviation',
    'StockInventory', 'AccountsReceivable', 'Machinery',
    'PlantEquipment', 'BusinessInterruption', 'KeymanInsurance',
    'ElectronicEquipment', 'GeneralLiability'
  ];

  useEffect(() => {
    loadClients();
    loadInsurers();
    if (id) {
      loadPolicy();
    }
  }, [id]);

  const loadClients = async () => {
    try {
      const response = await userService.getUsersByRole('Client');
      setClients(response.data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const loadInsurers = async () => {
    try {
      const response = await userService.getUsersByRole('Insurer');
      setInsurers(response.data);
    } catch (error) {
      console.error('Failed to load insurers:', error);
    }
  };

  const loadPolicy = async () => {
    try {
      const response = await policyService.getPolicy(id!);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load policy');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await policyService.updatePolicy(id, formData);
      } else {
        await policyService.createPolicy(formData);
      }
      navigate('/policies');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit' : 'New'} Policy
      </Typography>

      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="policyNumber"
                label="Policy Number"
                value={formData.policyNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="name"
                label="Policy Name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Policy Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Policy Type"
                  onChange={handleChange}
                >
                  {policyTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="PendingApproval">Pending Approval</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                name="coverageAmount"
                label="Coverage Amount ($)"
                value={formData.coverageAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                name="premium"
                label="Premium ($)"
                value={formData.premium}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                name="startDate"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                name="endDate"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Client</InputLabel>
                <Select
                  name="clientId"
                  value={formData.clientId}
                  label="Client"
                  onChange={handleChange}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} ({client.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Insurer (Optional)</InputLabel>
                <Select
                  name="insurerId"
                  value={formData.insurerId}
                  label="Insurer (Optional)"
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {insurers.map((insurer) => (
                    <MenuItem key={insurer.id} value={insurer.id}>
                      {insurer.firstName} {insurer.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/policies')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Policy'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};