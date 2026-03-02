export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: any;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: string;
}
