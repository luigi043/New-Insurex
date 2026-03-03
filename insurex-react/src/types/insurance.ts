/**
 * Global Enums to match Backend Constants
 */
export enum PolicyStatus {
  Draft = 'Draft',
  Active = 'Active',
  PendingRenewal = 'PendingRenewal',
  Cancelled = 'Cancelled',
  Expired = 'Expired'
}

export enum ClaimStatus {
  Submitted = 'Submitted',
  UnderReview = 'UnderReview',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Paid = 'Paid'
}

/**
 * Base Interface for shared fields
 */
interface BaseEntity {
  id: string;
  createdAt: string; // ISO Date string
  updatedAt: string;
}

/**
 * 🟢 Policy Interface
 */
export interface Policy extends BaseEntity {
  policyNumber: string;
  holderName: string;
  type: string; // e.g., 'Life', 'Auto', 'Property'
  status: PolicyStatus;
  premiumAmount: number;
  coverageLimit: number;
  startDate: string;
  endDate: string;
  assetIds: string[]; // Relationship to Assets
}

/**
 * 🟡 Claim Interface
 */
export interface Claim extends BaseEntity {
  policyId: string;
  claimNumber: string;
  incidentDate: string;
  reportedDate: string;
  description: string;
  claimedAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  documents: string[]; // URLs or IDs for attachments
}

/**
 * 🔵 Asset Interface
 */
export interface Asset extends BaseEntity {
  name: string;
  category: string; // e.g., 'Vehicle', 'Real Estate'
  valuation: number;
  serialNumber?: string;
  location?: string;
  description: string;
}

/**
 * 🟠 Partner Interface
 */
export interface Partner extends BaseEntity {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnerType: 'Broker' | 'Agency' | 'Adjuster';
  commissionRate: number;
}