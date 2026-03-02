import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const Loading: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>{message}</Typography>
  </Box>
);
