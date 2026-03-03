import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    resetErrorBoundary,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: 3,
                backgroundColor: 'background.default',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 6,
                    maxWidth: 500,
                    textAlign: 'center',
                    borderRadius: 4,
                }}
            >
                <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Oops! Algo deu errado.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
                </Typography>

                <Box
                    sx={{
                        p: 2,
                        mb: 4,
                        backgroundColor: 'grey.100',
                        borderRadius: 2,
                        textAlign: 'left',
                        overflow: 'auto',
                    }}
                >
                    <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                        {error.message}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    onClick={resetErrorBoundary}
                    sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                    Tentar Novamente
                </Button>
            </Paper>
        </Box>
    );
};
