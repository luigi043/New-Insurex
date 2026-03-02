export enum PolicyStatus {
  Draft = 'Draft',
  PendingApproval = 'PendingApproval',
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled'
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
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
