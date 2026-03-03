import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { authService } from '../../services/auth.service';

type VerificationStatus = 'pending' | 'success' | 'error';

const getQueryParam = (search: string, key: string) => {
  const params = new URLSearchParams(search);
  return params.get(key);
};

export const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [message, setMessage] = useState('Validando seu endereço de email...');

  const token = useMemo(() => getQueryParam(location.search, 'token'), [location.search]);
  const email = useMemo(() => getQueryParam(location.search, 'email'), [location.search]);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de verificação ausente. Solicite um novo link.');
        return;
      }

      try {
        await authService.verifyEmail({ token, email: email ?? undefined });
        setStatus('success');
        setMessage('Email verificado com sucesso! Você já pode fazer login.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error?.message || 'Não foi possível verificar seu email.');
      }
    };

    verify();
  }, [email, token]);

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 10 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Verificação de Email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {email ? `Conta: ${email}` : 'Confirmando seu acesso.'}
          </Typography>

          {status === 'pending' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress />
              <Typography variant="body2">{message}</Typography>
            </Box>
          )}

          {status !== 'pending' && (
            <Alert severity={status === 'success' ? 'success' : 'error'} sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          <Button component={Link} to="/login" variant="contained">
            Voltar para Login
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
