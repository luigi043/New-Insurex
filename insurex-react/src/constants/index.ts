export const POLICY_STATUS = { DRAFT: 'draft', ACTIVE: 'active', PENDING: 'pending', EXPIRED: 'expired', CANCELLED: 'cancelled' };
export const CLAIM_STATUS = { PENDING: 'pending', UNDER_REVIEW: 'under_review', APPROVED: 'approved', REJECTED: 'rejected', SETTLED: 'settled' };
export const ASSET_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive', UNDER_MAINTENANCE: 'under_maintenance', DISPOSED: 'disposed' };
export const USER_ROLES = { ADMIN: 'admin', CLIENT: 'client', INSURER: 'insurer', FINANCER: 'financer', BROKER: 'broker' };
export const ROUTES = { /* ... */ };
export const POLICY_STATUS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
} as const;

export const CLAIM_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'UnderReview',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PAID: 'Paid',
  CLOSED: 'Closed',
  ADDITIONAL_INFO: 'AdditionalInfoRequired',
} as const;

export const ASSET_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  UNDER_MAINTENANCE: 'UnderMaintenance',
  DISPOSED: 'Disposed',
  CLAIMED: 'Claimed',
} as const;

export const USER_ROLES = {
  ADMIN: 'Admin',
  CLIENT: 'Client',
  INSURER: 'Insurer',
  FINANCER: 'Financer',
  BROKER: 'Broker',
} as const;

export const INVOICE_STATUS = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
} as const;

export const ASSET_TYPES = [
  'Vehicle',
  'Property',
  'Watercraft',
  'Aviation',
  'StockInventory',
  'AccountsReceivable',
  'Machinery',
  'PlantEquipment',
  'BusinessInterruption',
  'KeymanInsurance',
  'ElectronicEquipment',
] as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CreditCard',
  BANK_TRANSFER: 'BankTransfer',
  CHECK: 'Check',
  CASH: 'Cash',
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MM/dd/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'MM/dd/yyyy HH:mm',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  POLICIES: '/policies',
  POLICY_NEW: '/policies/new',
  POLICY_EDIT: (id: string) => `/policies/edit/${id}`,
  POLICY_DETAIL: (id: string) => `/policies/${id}`,
  CLAIMS: '/claims',
  CLAIM_NEW: '/claims/new',
  CLAIM_DETAIL: (id: string) => `/claims/${id}`,
  ASSETS: '/assets',
  ASSET_NEW: '/assets/new',
  ASSET_TYPE: (type: string) => `/assets/new/${type}`,
  ASSET_DETAIL: (id: string) => `/assets/${id}`,
  BILLING: '/billing',
  INVOICES: '/billing/invoices',
  INVOICE_NEW: '/billing/invoices/new',
  REPORTS: '/reports',
  PARTNERS: '/partners',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;