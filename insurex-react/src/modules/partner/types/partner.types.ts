import { PaginationRequest, PagedResult } from '../../../types/common.types';

export enum PartnerType {
  Broker = 'Broker',
  Agent = 'Agent',
  Reinsurer = 'Reinsurer',
  ServiceProvider = 'ServiceProvider',
  Other = 'Other'
}

export enum PartnerStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
  Suspended = 'Suspended'
}

export interface Partner {
  id: number;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  commissionRate: number;
  paymentTerms: number;
  notes?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PartnerListItem {
  id: number;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  email: string;
  phone: string;
  city: string;
  country: string;
  commissionRate: number;
  policyCount: number;
  totalCommission: number;
}

export interface CreatePartnerRequest {
  name: string;
  type: PartnerType;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  commissionRate: number;
  paymentTerms: number;
  notes?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
}

export interface UpdatePartnerRequest {
  name?: string;
  type?: PartnerType;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  commissionRate?: number;
  paymentTerms?: number;
  notes?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
}

export interface PartnerFilterRequest extends PaginationRequest {
  searchTerm?: string;
  type?: PartnerType;
  status?: PartnerStatus;
  country?: string;
  city?: string;
  minCommissionRate?: number;
  maxCommissionRate?: number;
}

export interface PartnerStatistics {
  totalPartners: number;
  activePartners: number;
  inactivePartners: number;
  pendingPartners: number;
  partnersByType: Record<PartnerType, number>;
  totalCommissionPaid: number;
  totalPoliciesReferred: number;
}

export interface PartnerPolicy {
  policyId: number;
  policyNumber: string;
  insuredName: string;
  policyType: string;
  startDate: string;
  endDate: string;
  premium: number;
  commissionAmount: number;
  status: string;
}

export interface PartnerCommission {
  id: number;
  partnerId: number;
  policyId: number;
  policyNumber: string;
  commissionAmount: number;
  commissionRate: number;
  calculationDate: string;
  paymentDate?: string;
  status: 'Pending' | 'Paid' | 'Cancelled';
  paidAmount?: number;
  paidDate?: string;
  notes?: string;
}

export interface PartnerCommissionSummary {
  totalCommissionEarned: number;
  totalCommissionPaid: number;
  totalCommissionPending: number;
  commissionByMonth: Array<{
    month: string;
    amount: number;
  }>;
}

export interface PartnerActivity {
  id: number;
  partnerId: number;
  activityType: string;
  description: string;
  performedBy: string;
  performedAt: string;
  metadata?: Record<string, any>;
}

export interface ActivatePartnerRequest {
  activationNotes?: string;
}

export interface DeactivatePartnerRequest {
  deactivationReason: string;
}
