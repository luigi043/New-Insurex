import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Alert, MenuItem, Grid } from '@mui/material';
import { authService } from '../services/auth.service';
import { UserRole } from '../types/auth.types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: UserRole.Client });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Create Account</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="First Name" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Last Name" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} /></Grid>
              <Grid item xs={12}><TextField fullWidth type="email" label="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></Grid>
              <Grid item xs={12}><TextField fullWidth type="password" label="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="Role" value={form.role} onChange={(e) => setForm({...form, role: e.target.value as UserRole})}>
                  {Object.values(UserRole).map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/login">Already have an account? Sign In</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
