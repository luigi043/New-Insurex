import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container, Box, TextField, Button, Typography, Paper, Alert,
  CircularProgress, IconButton, InputAdornment, Checkbox, FormControlLabel,
  Divider, Chip, Grid, Tooltip,
} from '@mui/material';
import {
  Visibility, VisibilityOff, AdminPanelSettings, Badge, Person,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const DEMO_USERS = [
  {
    label: 'Admin',
    email: 'admin@insurex.co.za',
    password: 'Admin1234!',
    icon: AdminPanelSettings,
    color: '#1976d2',
    description: 'Full system access',
  },
  {
    label: 'Employee',
    email: 'employee@insurex.co.za',
    password: 'Employee1234!',
    icon: Badge,
    color: '#7c3aed',
    description: 'Policy management',
  },
  {
    label: 'Client',
    email: 'client@insurex.co.za',
    password: 'Client1234!',
    icon: Person,
    color: '#10b981',
    description: 'View own policies',
  },
];

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
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, label: string) => {
    setError('');
    setDemoLoading(label);
    try {
      await login({ email: demoEmail, password: demoPassword });
      navigate(from, { replace: true });
    } catch {
      navigate('/dashboard', { replace: true });
    } finally {
      setDemoLoading(null);
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
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          {/* Logo / Title */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="primary">InsureX</Typography>
            <Typography variant="body2" color="textSecondary">South Africa — Insurance Management Platform</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Demo user quick-login cards */}
          {IS_DEMO_MODE && (
            <>
              <Divider sx={{ mb: 2 }}>
                <Chip label="DEMO — Quick Login" size="small" color="primary" variant="outlined" />
              </Divider>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {DEMO_USERS.map((u) => {
                  const IconComp = u.icon;
                  const isThisLoading = demoLoading === u.label;
                  return (
                    <Grid item xs={4} key={u.label}>
                      <Tooltip title={`${u.email} / ${u.password}`} arrow>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleDemoLogin(u.email, u.password, u.label)}
                          disabled={!!demoLoading || loading}
                          sx={{
                            flexDirection: 'column',
                            py: 1.5,
                            borderColor: u.color,
                            color: u.color,
                            '&:hover': { backgroundColor: u.color + '10', borderColor: u.color },
                          }}
                        >
                          {isThisLoading
                            ? <CircularProgress size={22} sx={{ color: u.color }} />
                            : <IconComp sx={{ fontSize: 28, mb: 0.5 }} />}
                          <Typography variant="caption" fontWeight={600}>{u.label}</Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.65rem' }}>
                            {u.description}
                          </Typography>
                        </Button>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>
              <Divider sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">OR sign in manually</Typography>
              </Divider>
            </>
          )}

          {/* Manual login form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth margin="normal" label="Email Address" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              disabled={loading} required autoFocus autoComplete="email"
            />
            <TextField
              fullWidth margin="normal" label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password} onChange={(e) => setPassword(e.target.value)}
              disabled={loading} required autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                label="Remember me"
              />
              <Link to="/forgot-password" style={{ fontSize: '0.875rem' }}>Forgot password?</Link>
            </Box>
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, mb: 2 }}
              disabled={loading || !email || !password} size="large">
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Don&apos;t have an account?{' '}<Link to="/register">Sign Up</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
