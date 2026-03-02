export enum ClaimStatus {
  Submitted = 'Submitted',
  UnderReview = 'UnderReview',
  AdditionalInfoRequired = 'AdditionalInfoRequired',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Paid = 'Paid',
  Closed = 'Closed'
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

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  clientId: string;
  incidentDate: string;
  reportedDate: string;
  description: string;
  claimedAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  type: ClaimType;
  documents?: any[];
}
