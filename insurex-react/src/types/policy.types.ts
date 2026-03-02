export interface Policy {
  id: string;
  policyNumber: string;
  type: PolicyType;
  status: PolicyStatus;
  holderId: string;
  holderName: string;
  holderEmail: string;
  insuredId?: string;
  insuredName?: string;
  startDate: string;
  endDate: string;
  premium: number;
  coverageAmount: number;
  deductible: number;
  currency: string;
  paymentFrequency: PaymentFrequency;
  description?: string;
  terms?: string;
  exclusions?: string[];
  benefits?: PolicyBenefit[];
  documents?: PolicyDocument[];
  assets?: PolicyAsset[];
  beneficiaries?: Beneficiary[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type PolicyType = 
  | 'life'
  | 'health'
  | 'auto'
  | 'home'
  | 'property'
  | 'liability'
  | 'travel'
  | 'business'
  | 'marine'
  | 'agriculture'
  | 'other';

export type PolicyStatus = 
  | 'draft'
  | 'pending'
  | 'active'
  | 'suspended'
  | 'expired'
  | 'cancelled'
  | 'renewed';

export type PaymentFrequency = 
  | 'monthly'
  | 'quarterly'
  | 'semi-annual'
  | 'annual'
  | 'single';

export interface PolicyBenefit {
  id: string;
  name: string;
  description: string;
  coverageAmount: number;
  conditions?: string;
}

export interface PolicyDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PolicyAsset {
  id: string;
  assetId: string;
  assetName: string;
  assetType: string;
  coverageAmount: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  contactInfo?: string;
}

export interface PolicyFilter {
  status?: PolicyStatus;
  type?: PolicyType;
  search?: string;
  holderId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  minPremium?: number;
  maxPremium?: number;
}

export interface CreatePolicyData {
  type: PolicyType;
  holderId: string;
  insuredId?: string;
  startDate: string;
  endDate: string;
  premium: number;
  coverageAmount: number;
  deductible?: number;
  currency?: string;
  paymentFrequency: PaymentFrequency;
  description?: string;
  terms?: string;
  exclusions?: string[];
  benefits?: Omit<PolicyBenefit, 'id'>[];
  beneficiaries?: Omit<Beneficiary, 'id'>[];
}

export interface UpdatePolicyData extends Partial<CreatePolicyData> {
  status?: PolicyStatus;
}

export interface PolicyStats {
  totalPolicies: number;
  activePolicies: number;
  pendingPolicies: number;
  expiredPolicies: number;
  cancelledPolicies: number;
  totalPremium: number;
  totalCoverage: number;
  policiesByType: Record<PolicyType, number>;
  policiesByStatus: Record<PolicyStatus, number>;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PolicyRenewalData {
  newEndDate: string;
  newPremium?: number;
  reason?: string;
}

export interface PolicyCancellationData {
  reason: string;
  cancellationDate: string;
  refundAmount?: number;
}
