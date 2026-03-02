export interface Invoice {
  id: string;
  invoiceNumber: string;
  policyId: string;
  policyNumber: string;
  holderId: string;
  holderName: string;
  holderEmail: string;
  type: InvoiceType;
  status: InvoiceStatus;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  items: InvoiceItem[];
  payments?: Payment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum InvoiceType {
  PREMIUM = 'PREMIUM',
  RENEWAL = 'RENEWAL',
  ADJUSTMENT = 'ADJUSTMENT',
  CANCELLATION = 'CANCELLATION',
  LATE_FEE = 'LATE_FEE',
  PROCESSING_FEE = 'PROCESSING_FEE',
  OTHER = 'OTHER'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  transactionId?: string;
  paidBy: string;
  paidAt: string;
  notes?: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  CHECK = 'CHECK',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  OTHER = 'OTHER'
}

export interface CreateInvoiceData {
  policyId: string;
  type: InvoiceType;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  dueDate: string;
  description: string;
  items: InvoiceItem[];
  notes?: string;
}

export interface CreatePaymentData {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  transactionId?: string;
  notes?: string;
}

export interface BillingFilters {
  search?: string;
  status?: InvoiceStatus;
  type?: InvoiceType;
  policyId?: string;
  holderId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  isOverdue?: boolean;
}

export interface BillingStats {
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  totalOverdue: number;
  byStatus: Record<InvoiceStatus, number>;
}
