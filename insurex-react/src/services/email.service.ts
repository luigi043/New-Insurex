import api from './api';

export const emailService = {
  sendEmail: (data: { to: string; subject: string; body: string }) => {
    return api.post('/notifications/email', data);
  },

  getEmailLogs: (page: number = 1, pageSize: number = 20) => {
    return api.get(`/notifications/logs?page=${page}&pageSize=${pageSize}`);
  },

  getTemplates: () => {
    return api.get('/notifications/templates');
  }
};
