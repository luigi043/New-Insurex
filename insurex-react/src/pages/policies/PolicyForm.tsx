import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Grid, MenuItem, Alert } from '@mui/material';
import { policyService } from '../services/policy.service';
import { PolicyType, PolicyStatus } from '../types/policy.types';

export const PolicyForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    policyNumber: '', name: '', type: PolicyType.Vehicle, coverageAmount: 0, premium: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    clientId: '1', status: PolicyStatus.Draft
  });

  useEffect(() => {
    if (id) loadPolicy();
  }, [id]);

  const loadPolicy = async () => {
    const policy = await policyService.getPolicy(id!);
    setForm(policy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) await policyService.updatePolicy(id, form);
      else await policyService.createPolicy(form);
      navigate('/policies');
    } catch (err) {
      setError('Failed to save policy');
    } finally { setLoading(false); }
  };

  return (
    <Box><Typography variant="h4" gutterBottom>{id ? 'Edit' : 'New'} Policy</Typography>
      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Policy Number" value={form.policyNumber} onChange={(e) => setForm({...form, policyNumber: e.target.value})} required /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Type" value={form.type} onChange={(e) => setForm({...form, type: e.target.value as PolicyType})}>
                {Object.values(PolicyType).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Status" value={form.status} onChange={(e) => setForm({...form, status: e.target.value as PolicyStatus})}>
                {Object.values(PolicyStatus).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Coverage Amount" value={form.coverageAmount} onChange={(e) => setForm({...form, coverageAmount: Number(e.target.value)})} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Premium" value={form.premium} onChange={(e) => setForm({...form, premium: Number(e.target.value)})} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label="Start Date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth type="date" label="End Date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} InputLabelProps={{ shrink: true }} /></Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/policies')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
