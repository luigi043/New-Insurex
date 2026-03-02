import { User } from './auth.types';

export enum PolicyStatus {
  Draft = 'Draft',
  PendingApproval = 'PendingApproval',
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
  Suspended = 'Suspended'
}

export enum PolicyType {
  Vehicle = 'Vehicle',
  Property = 'Property',
  Watercraft = 'Watercraft',
  Aviation = 'Aviation',
  StockInventory = 'StockInventory',
  AccountsReceivable = 'AccountsReceivable',
  Machinery = 'Machinery',
  PlantEquipment = 'PlantEquipment',
  BusinessInterruption = 'BusinessInterruption',
  KeymanInsurance = 'KeymanInsurance',
  ElectronicEquipment = 'ElectronicEquipment',
  GeneralLiability = 'GeneralLiability'
}

export interface Policy {
  id: string;
  policyNumber: string;
  name: string;
  description: string;
  type: PolicyType;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  clientId: string;
  client?: User;
  insurerId?: string;
  insurer?: User;
  assets?: any[];
  claims?: any[];
  documents?: PolicyDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyDocument {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  description?: string;
  uploadedAt: string;
}

export interface PolicyFilter {
  status?: PolicyStatus;
  type?: PolicyType;
  clientId?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface CreatePolicyRequest {
  policyNumber: string;
  name: string;
  description?: string;
  type: PolicyType;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  clientId: string;
  insurerId?: string;
}

export interface UpdatePolicyRequest extends Partial<CreatePolicyRequest> {}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}
