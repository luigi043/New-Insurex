export interface Policy {
  id: string;
  policyNumber: string;
  type: PolicyType;
  status: PolicyStatus;
  holderId: string;
  holderName: string;
  holderEmail: string;
  holderPhone?: string;
  insuredAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  deductible?: number;
  coverageDetails: CoverageDetail[];
  beneficiaries?: Beneficiary[];
  documents?: PolicyDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  agentId?: string;
  agentName?: string;
}

export enum PolicyType {
  LIFE = 'LIFE',
  HEALTH = 'HEALTH',
  AUTO = 'AUTO',
  HOME = 'HOME',
  BUSINESS = 'BUSINESS',
  TRAVEL = 'TRAVEL',
  LIABILITY = 'LIABILITY',
  PROPERTY = 'PROPERTY'
}

export enum PolicyStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED'
}

export interface CoverageDetail {
  id: string;
  name: string;
  description: string;
  amount: number;
  premium: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  contactInfo?: string;
}

export interface PolicyDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface CreatePolicyData {
  policyNumber: string;
  type: PolicyType;
  holderId?: string;
  holderName: string;
  holderEmail: string;
  holderPhone?: string;
  insuredAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  deductible?: number;
  coverageDetails: CoverageDetail[];
  beneficiaries?: Beneficiary[];
  notes?: string;
}

export interface UpdatePolicyData extends Partial<CreatePolicyData> {
  status?: PolicyStatus;
}

export interface PolicyFilters {
  search?: string;
  type?: PolicyType;
  status?: PolicyStatus;
  holderId?: string;
  agentId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface PolicyStats {
  total: number;
  active: number;
  pending: number;
  expired: number;
  cancelled: number;
  totalPremium: number;
  totalInsured: number;
}
