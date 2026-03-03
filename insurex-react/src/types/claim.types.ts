export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  policyType: string;
  holderId: string;
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
  witnesses?: Witness[];
  documents?: ClaimDocument[];
  notes?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ClaimStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING_INFO = 'PENDING_INFO',
  APPROVED = 'APPROVED',
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',
  REJECTED = 'REJECTED',
  SETTLED = 'SETTLED',
  CLOSED = 'CLOSED',
  APPEALED = 'APPEALED'
}

export enum ClaimType {
  ACCIDENT = 'ACCIDENT',
  THEFT = 'THEFT',
  FIRE = 'FIRE',
  NATURAL_DISASTER = 'NATURAL_DISASTER',
  LIABILITY = 'LIABILITY',
  MEDICAL = 'MEDICAL',
  DEATH = 'DEATH',
  DISABILITY = 'DISABILITY',
  PROPERTY_DAMAGE = 'PROPERTY_DAMAGE',
  OTHER = 'OTHER'
}

export interface Witness {
  id: string;
  name: string;
  contactInfo: string;
  statement?: string;
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
  claimId: string;
  action: string;
  statusFrom?: ClaimStatus;
  statusTo?: ClaimStatus;
  notes?: string;
  performedBy: string;
  performedByName: string;
  createdAt: string;
}

export interface CreateClaimData {
  policyId: string;
  type: ClaimType;
  incidentDate: string;
  description: string;
  claimedAmount: number;
  location?: string;
  witnesses?: Witness[];
  notes?: string;
}

export interface UpdateClaimData extends Partial<CreateClaimData> {
  status?: ClaimStatus;
  approvedAmount?: number;
  settlementDate?: string;
}

export interface ClaimFormData {
  policyId: string;
  assetId?: string;
  type: ClaimType;
  status: ClaimStatus;
  description: string;
  incidentDate: string;
  incidentLocation?: string;
  claimedAmount: number;
  approvedAmount?: number;
  documents?: any[];
  notes?: string;
}

export interface ClaimFilters {
  search?: string;
  status?: ClaimStatus;
  type?: ClaimType;
  policyId?: string;
  holderId?: string;
  assignedTo?: string;
  incidentDateFrom?: string;
  incidentDateTo?: string;
  submittedDateFrom?: string;
  submittedDateTo?: string;
}

export interface ClaimStats {
  total: number;
  byStatus: Record<ClaimStatus, number>;
  totalClaimed: number;
  totalApproved: number;
  averageProcessingTime: number;
}
