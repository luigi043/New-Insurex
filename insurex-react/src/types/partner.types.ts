export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  contactPerson: string;
  email: string;
  phone: string;
  address?: Address;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  commissionRate?: number;
  paymentTerms?: string;
  services?: string[];
  notes?: string;
  documents?: PartnerDocument[];
  createdAt: string;
  updatedAt: string;
}

export enum PartnerType {
  AGENCY = 'AGENCY',
  BROKER = 'BROKER',
  REPAIR_SHOP = 'REPAIR_SHOP',
  MEDICAL_PROVIDER = 'MEDICAL_PROVIDER',
  LEGAL_FIRM = 'LEGAL_FIRM',
  ADJUSTER = 'ADJUSTER',
  INSURER = 'INSURER',
  SUPPLIER = 'SUPPLIER',
  OTHER = 'OTHER'
}

export enum PartnerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED'
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface PartnerDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface CreatePartnerData {
  name: string;
  type: PartnerType;
  contactPerson: string;
  email: string;
  phone: string;
  address?: Address;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  commissionRate?: number;
  paymentTerms?: string;
  services?: string[];
  notes?: string;
}

export interface UpdatePartnerData extends Partial<CreatePartnerData> {
  status?: PartnerStatus;
}

export interface PartnerFilters {
  search?: string;
  type?: PartnerType;
  status?: PartnerStatus;
}

export interface PartnerStats {
  total: number;
  byType: Record<PartnerType, number>;
  byStatus: Record<PartnerStatus, number>;
}
