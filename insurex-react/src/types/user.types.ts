export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  company?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  avatarUrl?: string;
  address?: Address;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserRole = 
  | 'admin' 
  | 'manager' 
  | 'agent' 
  | 'underwriter' 
  | 'claims_handler' 
  | 'finance' 
  | 'partner' 
  | 'customer';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UserPreferences {
  language?: string;
  timezone?: string;
  dateFormat?: string;
  currency?: string;
  notifications?: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  claims: boolean;
  policies: boolean;
  payments: boolean;
  marketing: boolean;
}

export interface UserFilter {
  role?: UserRole;
  search?: string;
  isActive?: boolean;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  company?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  isActive?: boolean;
  address?: Address;
  preferences?: UserPreferences;
}

export interface Partner {
  id: string;
  userId: string;
  companyName: string;
  type: PartnerType;
  status: PartnerStatus;
  commissionRate: number;
  licenseNumber?: string;
  website?: string;
  address: Address;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  bankDetails?: BankDetails;
  documents?: PartnerDocument[];
  performance?: PartnerPerformance;
  createdAt: string;
  updatedAt: string;
}

export type PartnerType = 'broker' | 'agent' | 'referrer' | 'affiliate';

export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'terminated';

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchCode?: string;
  swiftCode?: string;
}

export interface PartnerDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface PartnerPerformance {
  totalPolicies: number;
  totalPremium: number;
  totalCommission: number;
  activeCustomers: number;
  rating: number;
}
