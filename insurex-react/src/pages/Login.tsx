import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>InsureX</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            <TextField fullWidth margin="normal" type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/register">Don't have an account? Sign Up</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
