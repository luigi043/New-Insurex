import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const steps = ['Account Information', 'Personal Details', 'Confirmation'];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const validateStep = () => {
    setError('');

    if (activeStep === 0) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
    }

    if (activeStep === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        company: formData.company,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              autoFocus
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              required
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
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
            />
          </>
        );
      case 1:
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Company (Optional)"
              value={formData.company}
              onChange={handleChange('company')}
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: {formData.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Name: {formData.firstName} {formData.lastName}
            </Typography>
            {formData.phone && (
              <Typography variant="body2" color="textSecondary">
                Phone: {formData.phone}
              </Typography>
            )}
            {formData.company && (
              <Typography variant="body2" color="textSecondary">
                Company: {formData.company}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={activeStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
            {renderStepContent()}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button disabled={activeStep === 0 || loading} onClick={handleBack}>
                Back
              </Button>
              {activeStep === 2 ? (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Complete Registration'}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/login">Already have an account? Sign In</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
