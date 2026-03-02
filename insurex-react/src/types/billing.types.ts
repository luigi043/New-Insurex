export interface Invoice {
  id: string;
  invoiceNumber: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  items: InvoiceItem[];
  payments?: Payment[];
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceType = 'premium' | 'endorsement' | 'renewal' | 'fee' | 'refund';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'refunded';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  status: PaymentStatus;
  notes?: string;
  processedBy?: string;
  createdAt: string;
}

export type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'bank_transfer' 
  | 'check' 
  | 'cash' 
  | 'paypal' 
  | 'stripe' 
  | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentPlan {
  id: string;
  policyId: string;
  frequency: PaymentFrequency;
  totalAmount: number;
  installmentAmount: number;
  numberOfInstallments: number;
  startDate: string;
  installments: Installment[];
}

export type PaymentFrequency = 'monthly' | 'quarterly' | 'semi_annual' | 'annual';

export interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: InstallmentStatus;
  paidDate?: string;
  paidAmount?: number;
}

export type InstallmentStatus = 'pending' | 'paid' | 'overdue' | 'waived';

export interface BillingStats {
  totalInvoices: number;
  totalRevenue: number;
  totalOutstanding: number;
  totalOverdue: number;
  invoicesByStatus: Record<InvoiceStatus, number>;
  revenueByMonth: Record<string, number>;
}

export interface InvoiceFilter {
  status?: InvoiceStatus;
  type?: InvoiceType;
  search?: string;
  customerId?: string;
  policyId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateInvoiceData {
  policyId: string;
  type: InvoiceType;
  dueDate: string;
  items: Omit<InvoiceItem, 'id'>[];
  notes?: string;
  terms?: string;
}

export interface CreatePaymentData {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}
