export enum ClaimStatus {
  Submitted = 'Submitted',
  UnderReview = 'UnderReview',
  AdditionalInfoRequired = 'AdditionalInfoRequired',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Paid = 'Paid',
  Closed = 'Closed',
  Withdrawn = 'Withdrawn'
}

export enum ClaimType {
  PropertyDamage = 'PropertyDamage',
  Theft = 'Theft',
  Liability = 'Liability',
  PersonalInjury = 'PersonalInjury',
  BusinessInterruption = 'BusinessInterruption',
  VehicleAccident = 'VehicleAccident',
  NaturalDisaster = 'NaturalDisaster',
  Fire = 'Fire',
  Other = 'Other'
}

export enum DocumentCategory {
  PoliceReport = 'PoliceReport',
  MedicalReport = 'MedicalReport',
  RepairEstimate = 'RepairEstimate',
  PhotoEvidence = 'PhotoEvidence',
  Receipt = 'Receipt',
  LegalDocument = 'LegalDocument',
  Correspondence = 'Correspondence',
  Other = 'Other'
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  clientId: string;
  incidentDate: string;
  reportedDate: string;
  description: string;
  incidentLocation?: string;
  claimedAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  type: ClaimType;
  reviewedAt?: string;
  reviewedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  paymentReference?: string;
  rejectionReason?: string;
  documents: ClaimDocument[];
  notes: ClaimNote[];
  statusHistory: ClaimStatusHistory[];
}

export interface ClaimDocument {
  id: string;
  claimId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  description?: string;
  category: DocumentCategory;
  uploadedBy: string;
  createdAt: string;
}

export interface ClaimNote {
  id: string;
  claimId: string;
  content: string;
  author: string;
  isInternal: boolean;
  createdAt: string;
}

export interface ClaimStatusHistory {
  id: string;
  claimId: string;
  oldStatus: ClaimStatus;
  newStatus: ClaimStatus;
  changedBy: string;
  reason?: string;
  createdAt: string;
}