export interface Policy {
  id: string;
  policyNumber: string;
  name: string;
  description: string;
  type: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: string;
  clientId: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  insurerId?: string;
  insurer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assets?: any[];
  claims?: any[];
  documents?: any[];
}

export interface PolicyFilter {
  status?: string;
  type?: string;
  clientId?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}