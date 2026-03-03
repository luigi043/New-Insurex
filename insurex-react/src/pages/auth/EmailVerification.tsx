import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Container,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Email,
  Send,
} from '@mui/icons-material';
import { authService } from '../../services/auth.service';

type VerificationState = 'verifying' | 'success' | 'error' | 'resend';

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerificationState>(token ? 'verifying' : 'resend');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setState('verifying');
    try {
      await authService.verifyEmail(verificationToken);
      setState('success');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Email verification failed. The link may have expired.'
      );
      setState('error');
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail.trim()) return;

    setResendLoading(true);
    setResendSuccess(false);
    try {
      await authService.resendVerificationEmail(resendEmail);
      setResendSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to resend verification email.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  const renderVerifying = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CircularProgress size={64} sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Verifying your email...
      </Typography>
      <Typography color="text.secondary">
        Please wait while we verify your email address.
      </Typography>
    </Box>
  );

  const renderSuccess = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Email Verified Successfully!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Your email address has been verified. You can now sign in to your account.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/login')}
      >
        Go to Login
      </Button>
    </Box>
  );

  const renderError = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Verification Failed
      </Typography>
      <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
        {errorMessage}
      </Alert>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => setState('resend')}
        >
          Resend Verification Email
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Box>
    </Box>
  );

  const renderResend = () => (
    <Box sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Email sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Verify Your Email
        </Typography>
        <Typography color="text.secondary">
          Enter your email address and we'll send you a new verification link.
        </Typography>
      </Box>

      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Verification email sent! Please check your inbox and spam folder.
        </Alert>
      )}

      {errorMessage && !resendSuccess && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email Address"
        type="email"
        value={resendEmail}
        onChange={(e) => setResendEmail(e.target.value)}
        sx={{ mb: 2 }}
        aria-label="Email address for verification"
      />
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={resendLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
        onClick={handleResendVerification}
        disabled={resendLoading || !resendEmail.trim()}
      >
        {resendLoading ? 'Sending...' : 'Send Verification Email'}
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already verified?{' '}
          <RouterLink to="/login" style={{ color: '#1976d2' }}>
            Sign in
          </RouterLink>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          {state === 'verifying' && renderVerifying()}
          {state === 'success' && renderSuccess()}
          {state === 'error' && renderError()}
          {state === 'resend' && renderResend()}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;
