import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useNotificationProvider, NotificationContext, NotificationType } from '../../hooks/useNotification';

interface NotificationProviderProps {
  children: React.ReactNode;
}

const notificationTypeToSeverity = (type: NotificationType): AlertColor => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'info';
  }
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notification = useNotificationProvider();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
      {notification.notifications.map((n) => (
        <Snackbar
          key={n.id}
          open={true}
          autoHideDuration={n.duration}
          onClose={() => notification.hideNotification(n.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => notification.hideNotification(n.id)}
            severity={notificationTypeToSeverity(n.type)}
            sx={{ width: '100%' }}
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};
