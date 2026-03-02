import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
