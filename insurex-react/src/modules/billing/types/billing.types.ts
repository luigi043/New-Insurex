export interface Invoice {
  id: number;
  invoiceNumber: string;
  policyId: number;
  policyNumber: string;
  customerName: string;
  customerEmail: string;
  type: InvoiceType;
  status: InvoiceStatus;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  paidAmount?: number;
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
  Premium = 'Premium',
  Renewal = 'Renewal',
  Adjustment = 'Adjustment',
  Cancellation = 'Cancellation',
  LateFee = 'LateFee',
  ProcessingFee = 'ProcessingFee',
  Other = 'Other',
}
export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  PartiallyPaid = 'PartiallyPaid',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface Payment {
  id: string;
  invoiceId: number;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  transactionId?: string;
  paidBy: string;
  paidAt: string;
  notes?: string;
}
export enum PaymentMethod {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  BankTransfer = 'BankTransfer',
  Cash = 'Cash',
  Check = 'Check',
  DigitalWallet = 'DigitalWallet',
  Other = 'Other',
}
export interface CreateInvoiceData {
  policyId: number;
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
  amount: number;
  method: PaymentMethod;
  reference?: string;
  transactionId?: string;
  notes?: string;
}
export interface BillingFilterRequest {
  page: number;
  pageSize: number;
  searchTerm?: string;
  status?: InvoiceStatus;
  type?: InvoiceType;
}