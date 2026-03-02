export enum PartnerType {
  BROKER = 'broker',
  AGENCY = 'agency',
  ADJUSTER = 'adjuster',
  REPAIR_SHOP = 'repair_shop',
  OTHER = 'other'
}

export enum PartnerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  document: string;
  email: string;
  phone?: string;
  mobile?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  commission?: number;
    notes?: string;
  createdAt: string;
  updatedAt: string;
}