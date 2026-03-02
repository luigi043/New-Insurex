import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error', 
  message, 
  onRetry 
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity="error" 
        action={onRetry && (
          <button onClick={onRetry}>Retry</button>
        )}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};
