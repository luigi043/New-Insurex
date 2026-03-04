import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
} from '@mui/material';
import { Visibility, VisibilityOff, PlayArrow } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login({ email: 'admin@insurex.com', password: 'Demo1234!' });
      navigate(from, { replace: true });
    } catch {
      // In demo mode the mock interceptor handles this; navigate directly
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            InsureX
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoFocus
              autoComplete="email"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link to="/forgot-password" style={{ fontSize: '0.875rem' }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !email || !password}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          {IS_DEMO_MODE && (
            <>
              <Divider sx={{ my: 2 }}>
                <Chip label="DEMO" size="small" color="primary" variant="outlined" />
              </Divider>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleDemoLogin}
                disabled={loading}
                sx={{
                  mb: 2,
                  borderStyle: 'dashed',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                  '&:hover': { borderStyle: 'solid', background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)' },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Try Demo — No Login Required'}
              </Button>
            </>
          )}

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/register">Sign Up</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
