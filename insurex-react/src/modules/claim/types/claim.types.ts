export interface Claim {
  id: number;
  claimNumber: string;
  policyId: number;
  policyNumber: string;
  holderName: string;
  holderEmail: string;
  status: ClaimStatus;
  type: ClaimType;
  incidentDate: string;
  reportedDate: string;
  description: string;
  claimedAmount: number;
  approvedAmount?: number;
  deductible?: number;
  settlementDate?: string;
  location?: string;
  documents?: ClaimDocument[];
  notes?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}
export enum ClaimStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  UnderReview = 'UnderReview',
  PendingInfo = 'PendingInfo',
  Approved = 'Approved',
  PartiallyApproved = 'PartiallyApproved',
  Rejected = 'Rejected',
  Paid = 'Paid',
  Closed = 'Closed',
  Appealed = 'Appealed',
}
export enum ClaimType {
  Accident = 'Accident',
  Theft = 'Theft',
  Fire = 'Fire',
  NaturalDisaster = 'NaturalDisaster',
  Liability = 'Liability',
  Medical = 'Medical',
  Death = 'Death',
  Disability = 'Disability',
  PropertyDamage = 'PropertyDamage',
  Other = 'Other',
}
export interface ClaimDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}
export interface ClaimHistory {
  id: string;
  claimId: number;
  action: string;
  statusFrom?: ClaimStatus;
  statusTo?: ClaimStatus;
  notes?: string;
  performedBy: string;
  performedByName: string;
  createdAt: string;
}
export interface CreateClaimData {
  policyId: number;
  type: ClaimType;
  incidentDate: string;
  description: string;
  claimedAmount: number;
  location?: string;
  notes?: string;
}
export interface UpdateClaimData extends Partial<CreateClaimData> {
  status?: ClaimStatus;
  approvedAmount?: number;
}
export interface ClaimFilterRequest {
  page: number;
  pageSize: number;
  searchTerm?: string;
  status?: ClaimStatus;
  type?: ClaimType;
}