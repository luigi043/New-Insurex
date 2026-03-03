import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Container,
    Alert,
    CircularProgress
} from '@mui/material';
import { LockOpen, VpnKey } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

export const TwoFactorAuth: React.FC = () => {
    const navigate = useNavigate();
    const { verify2FA, isLoading } = useAuth();
    const { showSuccess, showError } = useNotification();
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length < 6) {
            setError('Please enter a valid 6-digit code.');
            return;
        }

        try {
            await verify2FA(code);
            showSuccess('2FA Verification successful!');
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid 2FA code. Please try again.');
            showError('2FA Verification failed.');
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
                <Paper sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                    <VpnKey sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Two-Factor Authentication
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Please enter the 6-digit verification code from your authenticator app.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Verification Code"
                            variant="outlined"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '24px' } }}
                            sx={{ mb: 3 }}
                            placeholder="000000"
                            disabled={isLoading}
                            autoFocus
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={isLoading || code.length < 6}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockOpen />}
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Continue'}
                        </Button>
                    </form>

                    <Button
                        variant="text"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default TwoFactorAuth;
