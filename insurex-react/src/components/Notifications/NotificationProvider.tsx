import React, { createContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
}

export interface NotificationContextType {
  showNotification: (message: string, type: AlertColor, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  const showNotification = useCallback(
    (message: string, type: AlertColor, duration: number = 5000) => {
      const id = Math.random().toString(36).substring(7);
      setNotification({ id, message, type, duration });
      setOpen(true);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, 'success', duration);
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, 'error', duration);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, 'warning', duration);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showNotification(message, 'info', duration);
    },
    [showNotification]
  );

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setNotification(null);
  };

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={notification?.duration || 5000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification?.type || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
