import api from './api';
import { Invoice } from '../types/billing.types';

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', clientId: '1', clientName: 'João Silva', issueDate: '2024-02-01', dueDate: '2024-03-01', amount: 15000, status: 'Paid' },
  { id: '2', invoiceNumber: 'INV-2024-002', clientId: '2', clientName: 'Maria Santos', issueDate: '2024-02-15', dueDate: '2024-03-15', amount: 25000, status: 'Sent' },
  { id: '3', invoiceNumber: 'INV-2024-003', clientId: '3', clientName: 'Pedro Oliveira', issueDate: '2024-01-20', dueDate: '2024-02-20', amount: 8000, status: 'Overdue' }
];

export const billingService = {
  async getInvoices(page = 1, pageSize = 10, status?: string) {
    let filtered = mockInvoices;
    if (status) filtered = mockInvoices.filter(i => i.status === status);
    return {
      items: filtered,
      totalItems: filtered.length,
      page,
      pageSize
    };
  },

  async getInvoice(id: string): Promise<Invoice> {
    const invoice = mockInvoices.find(i => i.id === id);
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
  }
};
