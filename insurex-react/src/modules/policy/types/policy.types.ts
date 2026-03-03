export interface PolicyListItem {
  id: number;
  policyNumber: string;
  insuredName: string;
  type: PolicyType;
  status: PolicyStatus;
  premium: number;
  startDate: string;
  endDate: string;
}
export interface Policy {
  id: number;
  policyNumber: string;
  type: PolicyType;
  status: PolicyStatus;
  insuredName: string;
  insuredEmail: string;
  insuredPhone?: string;
  insuredAmount: number;
  premium: number;
  deductible?: number;
  startDate: string;
  endDate: string;
  coverageDetails?: CoverageDetail[];
  beneficiaries?: Beneficiary[];
  documents?: PolicyDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  agentId?: string;
  agentName?: string;
}
export enum PolicyType {
  Life = 'Life',
  Health = 'Health',
  Auto = 'Auto',
  Home = 'Home',
  Business = 'Business',
  Travel = 'Travel',
  Liability = 'Liability',
  Property = 'Property',
}
export enum PolicyStatus {
  Draft = 'Draft',
  PendingApproval = 'PendingApproval',
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
  Suspended = 'Suspended',
}
export interface CoverageDetail {
  id?: string;
  name: string;
  description: string;
  amount: number;
  premium: number;
}
export interface Beneficiary {
  id?: string;
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
  type: PolicyType;
  insuredName: string;
  insuredEmail: string;
  insuredPhone?: string;
  insuredAmount: number;
  premium: number;
  deductible?: number;
  startDate: string;
  endDate: string;
  coverageDetails?: CoverageDetail[];
  beneficiaries?: Beneficiary[];
  notes?: string;
}
export interface UpdatePolicyData extends Partial<CreatePolicyData> {
  status?: PolicyStatus;
}
export interface PolicyFilterRequest {
  page: number;
  pageSize: number;
  searchTerm?: string;
  type?: PolicyType;
  status?: PolicyStatus;
}