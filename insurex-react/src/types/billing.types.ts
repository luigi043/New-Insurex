export interface Invoice {
  id: string;
  invoiceNumber: string;
  policyId: string;
  policy?: any;
  clientId: string;
  client?: any;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  items: InvoiceItem[];
  paymentReference?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Check';
  reference: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  notes?: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  type: 'Premium' | 'Claim' | 'Refund' | 'Fee';
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  date: string;
  policyId?: string;
  claimId?: string;
  invoiceId?: string;
  description?: string;
  paymentMethod?: string;
  reference?: string;
}
