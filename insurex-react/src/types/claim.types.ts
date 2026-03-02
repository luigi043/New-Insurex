export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  claimantId: string;
  claimantName: string;
  type: ClaimType;
  status: ClaimStatus;
  incidentDate: string;
  reportedDate: string;
  description: string;
  location?: string;
  estimatedAmount: number;
  approvedAmount?: number;
  paidAmount?: number;
  currency: string;
  deductible?: number;
  causeOfLoss?: string;
  injuries?: boolean;
  injuriesDescription?: string;
  policeReport?: boolean;
  policeReportNumber?: string;
  thirdPartyInvolved?: boolean;
  thirdPartyDetails?: string;
  documents?: ClaimDocument[];
  notes?: ClaimNote[];
  payments?: ClaimPayment[];
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  settledAt?: string;
  rejectedAt?: string;
}

export type ClaimType =
  | 'property_damage'
  | 'theft'
  | 'liability'
  | 'bodily_injury'
  | 'medical'
  | 'collision'
  | 'comprehensive'
  | 'fire'
  | 'flood'
  | 'natural_disaster'
  | 'vandalism'
  | 'other';

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'pending_info'
  | 'approved'
  | 'partially_approved'
  | 'rejected'
  | 'in_payment'
  | 'settled'
  | 'closed'
  | 'reopened';

export interface ClaimDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ClaimNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  isInternal: boolean;
}

export interface ClaimPayment {
  id: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
  paidTo: string;
  paidBy: string;
}

export interface ClaimFilter {
  status?: ClaimStatus;
  type?: ClaimType;
  search?: string;
  policyId?: string;
  claimantId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateClaimData {
  policyId: string;
  type: ClaimType;
  incidentDate: string;
  description: string;
  location?: string;
  estimatedAmount: number;
  currency?: string;
  causeOfLoss?: string;
  injuries?: boolean;
  injuriesDescription?: string;
  policeReport?: boolean;
  policeReportNumber?: string;
  thirdPartyInvolved?: boolean;
  thirdPartyDetails?: string;
}

export interface UpdateClaimData extends Partial<CreateClaimData> {
  status?: ClaimStatus;
  approvedAmount?: number;
  paidAmount?: number;
  deductible?: number;
}

export interface ClaimStats {
  totalClaims: number;
  claimsByStatus: Record<ClaimStatus, number>;
  claimsByType: Record<ClaimType, number>;
  totalEstimated: number;
  totalApproved: number;
  totalPaid: number;
  averageProcessingTime: number;
}

export interface ClaimWorkflowAction {
  action: 'submit' | 'review' | 'request_info' | 'approve' | 'partial_approve' | 'reject' | 'pay' | 'settle' | 'close' | 'reopen';
  notes?: string;
  amount?: number;
}
