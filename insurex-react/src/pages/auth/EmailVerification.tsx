import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { authService } from '../../services/auth.service';

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await authService.verifyEmail(token!);
      setStatus('success');
      setMessage(response.data.message || 'Your email has been successfully verified!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { state: { verified: true } });
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(
        error.response?.data?.message || 
        'Email verification failed. The link may have expired or is invalid.'
      );
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Email address not found. Please request a new verification email from the login page.');
      return;
    }

    setResending(true);
    try {
      await authService.resendVerificationEmail(email);
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || 
        'Failed to resend verification email. Please try again later.'
      );
    } finally {
      setResending(false);
    }
  };

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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Verifying Your Email
              </Typography>
              <Typography color="textSecondary">
                Please wait while we verify your email address...
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle
                sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom color="success.main">
                Email Verified!
              </Typography>
              <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                {message}
              </Alert>
              <Typography color="textSecondary" sx={{ mb: 3 }}>
                Redirecting to login page...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Go to Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Error
                sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom color="error">
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ mt: 2, mb: 3 }}>
                {message}
              </Alert>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {email && (
                  <Button
                    variant="contained"
                    onClick={handleResendVerification}
                    disabled={resending}
                    fullWidth
                  >
                    {resending ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  fullWidth
                >
                  Back to Login
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;
