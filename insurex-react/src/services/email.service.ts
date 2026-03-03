import api from './api';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template?: string;
  status: 'Sent' | 'Failed' | 'Pending';
  sentAt: string;
  error?: string;
}

export const emailService = {
  sendEmail: (data: { to: string; subject: string; body: string }) => {
    return api.post('/notifications/email', data);
  },

  sendTemplatedEmail: (data: { to: string; template: string; data: Record<string, any> }) => {
    return api.post('/notifications/email/template', data);
  },

  getTemplates: () => {
    return api.get<EmailTemplate[]>('/notifications/templates');
  },

  getEmailLogs: (page: number = 1, pageSize: number = 20) => {
    return api.get(`/notifications/logs?page=${page}&pageSize=${pageSize}`);
  },

  sendPolicyConfirmation: (policyId: string) => {
    return api.post(`/notifications/policy/${policyId}/confirmation`);
  },

  sendClaimUpdate: (claimId: string) => {
    return api.post(`/notifications/claim/${claimId}/update`);
  },

  sendInvoiceNotification: (invoiceId: string) => {
    return api.post(`/notifications/invoice/${invoiceId}/notification`);
  }
};
