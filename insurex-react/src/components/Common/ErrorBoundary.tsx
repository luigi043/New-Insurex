import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ErrorMessage } from './ErrorMessage';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled UI error', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <Box sx={{ p: 4 }}>
          <ErrorMessage
            title="Something went wrong"
            message={error?.message || 'An unexpected error occurred.'}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={this.handleRetry}>
              Try again
            </Button>
            <Typography variant="body2" color="text.secondary">
              Reload the page if the issue persists.
            </Typography>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
