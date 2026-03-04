import { User, UserRole } from '../../types/auth.types';
import { Policy, PolicyType, PolicyStatus } from '../../types/policy.types';
import { Claim, ClaimStatus, ClaimType } from '../../types/claim.types';

export const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'admin@insurex.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  role: UserRole.Admin,
  isActive: true,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
  lastLogin: new Date().toISOString(),
  phone: '+1 (555) 123-4567',
  position: 'System Administrator',
  department: 'IT Operations',
  company: 'InsureX Corp',
};

export const DEMO_AUTH_RESPONSE = {
  user: DEMO_USER,
  accessToken: 'demo-access-token-insurex-2025',
  refreshToken: 'demo-refresh-token-insurex-2025',
};

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'pol-001', policyNumber: 'POL-2025-0001', type: PolicyType.AUTO, status: PolicyStatus.ACTIVE,
    holderId: 'holder-001', holderName: 'Michael Thompson', holderEmail: 'michael.thompson@email.com',
    holderPhone: '+1 (555) 234-5678', insuredAmount: 45000, premium: 1200,
    startDate: '2025-01-01', endDate: '2026-01-01', deductible: 500,
    coverageDetails: [
      { id: 'cov-001', name: 'Collision', description: 'Covers collision damage', amount: 45000, premium: 600 },
      { id: 'cov-002', name: 'Comprehensive', description: 'Non-collision damage', amount: 45000, premium: 400 },
      { id: 'cov-003', name: 'Liability', description: 'Third-party liability', amount: 100000, premium: 200 },
    ],
    notes: 'Premium customer - 5 year no-claim history',
    createdAt: '2024-12-15T09:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-001', agentName: 'Sarah Williams',
  },
  {
    id: 'pol-002', policyNumber: 'POL-2025-0002', type: PolicyType.HOME, status: PolicyStatus.ACTIVE,
    holderId: 'holder-002', holderName: 'Jennifer Martinez', holderEmail: 'jennifer.martinez@email.com',
    holderPhone: '+1 (555) 345-6789', insuredAmount: 350000, premium: 2400,
    startDate: '2025-02-01', endDate: '2026-02-01', deductible: 1000,
    coverageDetails: [
      { id: 'cov-004', name: 'Structure', description: 'Building structure coverage', amount: 350000, premium: 1500 },
      { id: 'cov-005', name: 'Contents', description: 'Personal property coverage', amount: 75000, premium: 600 },
      { id: 'cov-006', name: 'Liability', description: 'Personal liability', amount: 300000, premium: 300 },
    ],
    notes: 'New construction - 2023 build',
    createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-02-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-002', agentName: 'David Chen',
  },
  {
    id: 'pol-003', policyNumber: 'POL-2025-0003', type: PolicyType.HEALTH, status: PolicyStatus.ACTIVE,
    holderId: 'holder-003', holderName: 'Robert Davis', holderEmail: 'robert.davis@email.com',
    holderPhone: '+1 (555) 456-7890', insuredAmount: 500000, premium: 3600,
    startDate: '2025-01-01', endDate: '2026-01-01', deductible: 2000,
    coverageDetails: [
      { id: 'cov-007', name: 'Hospitalization', description: 'In-patient hospital coverage', amount: 500000, premium: 2000 },
      { id: 'cov-008', name: 'Outpatient', description: 'Outpatient medical coverage', amount: 50000, premium: 1000 },
      { id: 'cov-009', name: 'Dental & Vision', description: 'Dental and vision care', amount: 10000, premium: 600 },
    ],
    createdAt: '2024-12-01T08:00:00Z', updatedAt: '2025-01-01T00:00:00Z', createdBy: 'demo-user-001',
  },
  {
    id: 'pol-004', policyNumber: 'POL-2025-0004', type: PolicyType.LIFE, status: PolicyStatus.ACTIVE,
    holderId: 'holder-004', holderName: 'Emily Wilson', holderEmail: 'emily.wilson@email.com',
    holderPhone: '+1 (555) 567-8901', insuredAmount: 1000000, premium: 4800,
    startDate: '2025-03-01', endDate: '2055-03-01',
    coverageDetails: [
      { id: 'cov-010', name: 'Term Life', description: '30-year term life insurance', amount: 1000000, premium: 4800 },
    ],
    beneficiaries: [
      { id: 'ben-001', name: 'James Wilson', relationship: 'Spouse', percentage: 60, contactInfo: 'james.wilson@email.com' },
      { id: 'ben-002', name: 'Olivia Wilson', relationship: 'Child', percentage: 40, contactInfo: '' },
    ],
    createdAt: '2025-02-15T11:00:00Z', updatedAt: '2025-03-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-001', agentName: 'Sarah Williams',
  },
  {
    id: 'pol-005', policyNumber: 'POL-2025-0005', type: PolicyType.BUSINESS, status: PolicyStatus.ACTIVE,
    holderId: 'holder-005', holderName: 'TechStart Solutions LLC', holderEmail: 'insurance@techstart.com',
    holderPhone: '+1 (555) 678-9012', insuredAmount: 2000000, premium: 12000,
    startDate: '2025-01-01', endDate: '2026-01-01', deductible: 5000,
    coverageDetails: [
      { id: 'cov-011', name: 'General Liability', description: 'Business general liability', amount: 2000000, premium: 5000 },
      { id: 'cov-012', name: 'Property', description: 'Business property coverage', amount: 500000, premium: 4000 },
      { id: 'cov-013', name: 'Cyber Liability', description: 'Cyber security coverage', amount: 1000000, premium: 3000 },
    ],
    notes: 'Tech startup - 50 employees',
    createdAt: '2024-11-15T09:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-003', agentName: 'Lisa Anderson',
  },
  {
    id: 'pol-006', policyNumber: 'POL-2024-0089', type: PolicyType.AUTO, status: PolicyStatus.EXPIRED,
    holderId: 'holder-006', holderName: 'Carlos Rodriguez', holderEmail: 'carlos.rodriguez@email.com',
    holderPhone: '+1 (555) 789-0123', insuredAmount: 28000, premium: 980,
    startDate: '2024-01-01', endDate: '2025-01-01', deductible: 750,
    coverageDetails: [
      { id: 'cov-014', name: 'Collision', description: 'Covers collision damage', amount: 28000, premium: 580 },
      { id: 'cov-015', name: 'Liability', description: 'Third-party liability', amount: 100000, premium: 400 },
    ],
    createdAt: '2023-12-15T09:00:00Z', updatedAt: '2025-01-01T00:00:00Z', createdBy: 'demo-user-001',
  },
  {
    id: 'pol-007', policyNumber: 'POL-2025-0007', type: PolicyType.TRAVEL, status: PolicyStatus.PENDING,
    holderId: 'holder-007', holderName: 'Amanda Foster', holderEmail: 'amanda.foster@email.com',
    holderPhone: '+1 (555) 890-1234', insuredAmount: 50000, premium: 450,
    startDate: '2025-08-01', endDate: '2025-08-31',
    coverageDetails: [
      { id: 'cov-016', name: 'Medical Emergency', description: 'Emergency medical coverage abroad', amount: 50000, premium: 250 },
      { id: 'cov-017', name: 'Trip Cancellation', description: 'Trip cancellation coverage', amount: 5000, premium: 150 },
      { id: 'cov-018', name: 'Baggage Loss', description: 'Lost or stolen baggage', amount: 2000, premium: 50 },
    ],
    createdAt: '2025-07-01T10:00:00Z', updatedAt: '2025-07-01T10:00:00Z', createdBy: 'demo-user-001',
  },
  {
    id: 'pol-008', policyNumber: 'POL-2025-0008', type: PolicyType.PROPERTY, status: PolicyStatus.ACTIVE,
    holderId: 'holder-008', holderName: 'Green Valley Farms Inc.', holderEmail: 'admin@greenvalleyfarms.com',
    holderPhone: '+1 (555) 901-2345', insuredAmount: 800000, premium: 6500,
    startDate: '2025-04-01', endDate: '2026-04-01', deductible: 2500,
    coverageDetails: [
      { id: 'cov-019', name: 'Farm Property', description: 'Farm buildings and equipment', amount: 500000, premium: 3500 },
      { id: 'cov-020', name: 'Crop Insurance', description: 'Crop loss coverage', amount: 300000, premium: 3000 },
    ],
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-04-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-002', agentName: 'David Chen',
  },
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'clm-001', claimNumber: 'CLM-2025-0001', policyId: 'pol-001', policyNumber: 'POL-2025-0001',
    policyType: 'AUTO', holderId: 'holder-001', holderName: 'Michael Thompson',
    holderEmail: 'michael.thompson@email.com', status: ClaimStatus.UNDER_REVIEW, type: ClaimType.ACCIDENT,
    incidentDate: '2025-06-15', reportedDate: '2025-06-16',
    description: 'Rear-end collision at intersection of Main St and 5th Ave.',
    claimedAmount: 8500, deductible: 500, location: 'Main St & 5th Ave, Springfield, IL',
    assignedTo: 'demo-user-001', assignedToName: 'Alex Johnson',
    createdAt: '2025-06-16T09:00:00Z', updatedAt: '2025-06-17T14:00:00Z',
  },
  {
    id: 'clm-002', claimNumber: 'CLM-2025-0002', policyId: 'pol-002', policyNumber: 'POL-2025-0002',
    policyType: 'HOME', holderId: 'holder-002', holderName: 'Jennifer Martinez',
    holderEmail: 'jennifer.martinez@email.com', status: ClaimStatus.APPROVED, type: ClaimType.FIRE,
    incidentDate: '2025-05-20', reportedDate: '2025-05-20',
    description: 'Kitchen fire caused by electrical fault. Damage to kitchen and dining area.',
    claimedAmount: 45000, approvedAmount: 42000, deductible: 1000,
    location: '123 Oak Street, Springfield, IL',
    assignedTo: 'demo-user-001', assignedToName: 'Alex Johnson',
    createdAt: '2025-05-20T16:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'clm-003', claimNumber: 'CLM-2025-0003', policyId: 'pol-003', policyNumber: 'POL-2025-0003',
    policyType: 'HEALTH', holderId: 'holder-003', holderName: 'Robert Davis',
    holderEmail: 'robert.davis@email.com', status: ClaimStatus.SUBMITTED, type: ClaimType.MEDICAL,
    incidentDate: '2025-07-01', reportedDate: '2025-07-03',
    description: 'Emergency appendectomy surgery. 3-day hospital stay required.',
    claimedAmount: 28000, deductible: 2000, location: 'Springfield General Hospital',
    createdAt: '2025-07-03T11:00:00Z', updatedAt: '2025-07-03T11:00:00Z',
  },
  {
    id: 'clm-004', claimNumber: 'CLM-2025-0004', policyId: 'pol-001', policyNumber: 'POL-2025-0001',
    policyType: 'AUTO', holderId: 'holder-001', holderName: 'Michael Thompson',
    holderEmail: 'michael.thompson@email.com', status: ClaimStatus.SETTLED, type: ClaimType.THEFT,
    incidentDate: '2025-03-10', reportedDate: '2025-03-11',
    description: 'Vehicle stereo system and personal items stolen from parked car.',
    claimedAmount: 3200, approvedAmount: 2800, settlementDate: '2025-04-01',
    location: 'Downtown Parking Garage, Level 3',
    createdAt: '2025-03-11T08:00:00Z', updatedAt: '2025-04-01T15:00:00Z',
  },
  {
    id: 'clm-005', claimNumber: 'CLM-2025-0005', policyId: 'pol-005', policyNumber: 'POL-2025-0005',
    policyType: 'BUSINESS', holderId: 'holder-005', holderName: 'TechStart Solutions LLC',
    holderEmail: 'insurance@techstart.com', status: ClaimStatus.REJECTED, type: ClaimType.PROPERTY_DAMAGE,
    incidentDate: '2025-04-15', reportedDate: '2025-04-16',
    description: 'Water damage to server room. Rejected due to lack of maintenance.',
    claimedAmount: 75000, deductible: 5000, location: '456 Tech Park Drive, Suite 200',
    createdAt: '2025-04-16T09:00:00Z', updatedAt: '2025-05-10T14:00:00Z',
  },
  {
    id: 'clm-006', claimNumber: 'CLM-2025-0006', policyId: 'pol-008', policyNumber: 'POL-2025-0008',
    policyType: 'PROPERTY', holderId: 'holder-008', holderName: 'Green Valley Farms Inc.',
    holderEmail: 'admin@greenvalleyfarms.com', status: ClaimStatus.UNDER_REVIEW, type: ClaimType.NATURAL_DISASTER,
    incidentDate: '2025-06-28', reportedDate: '2025-06-29',
    description: 'Severe hailstorm caused extensive damage to crops and greenhouse structures.',
    claimedAmount: 120000, deductible: 2500, location: 'Green Valley Farms, Rural Route 4',
    assignedTo: 'demo-user-001', assignedToName: 'Alex Johnson',
    createdAt: '2025-06-29T10:00:00Z', updatedAt: '2025-07-01T09:00:00Z',
  },
];

export const MOCK_ASSETS = [
  { id: 'ast-001', assetNumber: 'AST-2025-0001', name: '2022 Toyota Camry', type: 'VEHICLE', status: 'ACTIVE',
    description: 'Silver Toyota Camry XSE', value: 28500, purchaseDate: '2022-03-15', purchasePrice: 32000,
    location: 'Springfield, IL', ownerId: 'holder-001', ownerName: 'Michael Thompson',
    policyId: 'pol-001', policyNumber: 'POL-2025-0001', serialNumber: '4T1BF1FK5CU123456',
    createdAt: '2025-01-01T09:00:00Z', updatedAt: '2025-01-01T09:00:00Z' },
  { id: 'ast-002', assetNumber: 'AST-2025-0002', name: 'Residential Property - 123 Oak Street', type: 'REAL_ESTATE', status: 'ACTIVE',
    description: '4-bedroom, 3-bathroom single family home, 2,800 sq ft', value: 385000, purchaseDate: '2023-06-01', purchasePrice: 360000,
    location: '123 Oak Street, Springfield, IL 62701', ownerId: 'holder-002', ownerName: 'Jennifer Martinez',
    policyId: 'pol-002', policyNumber: 'POL-2025-0002',
    createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-02-01T10:00:00Z' },
  { id: 'ast-003', assetNumber: 'AST-2025-0003', name: 'Dell PowerEdge Server Rack', type: 'EQUIPMENT', status: 'ACTIVE',
    description: 'Dell PowerEdge R750 Server, 32-core, 256GB RAM', value: 45000, purchaseDate: '2024-01-10', purchasePrice: 52000,
    location: '456 Tech Park Drive, Suite 200', ownerId: 'holder-005', ownerName: 'TechStart Solutions LLC',
    policyId: 'pol-005', policyNumber: 'POL-2025-0005', serialNumber: 'DELL-R750-2024-001', warrantyExpiry: '2027-01-10',
    createdAt: '2025-01-01T08:00:00Z', updatedAt: '2025-01-01T08:00:00Z' },
  { id: 'ast-004', assetNumber: 'AST-2025-0004', name: 'John Deere 8R Tractor', type: 'EQUIPMENT', status: 'ACTIVE',
    description: 'John Deere 8R 410 Tractor, 410 HP', value: 380000, purchaseDate: '2023-09-01', purchasePrice: 420000,
    location: 'Green Valley Farms, Rural Route 4', ownerId: 'holder-008', ownerName: 'Green Valley Farms Inc.',
    policyId: 'pol-008', policyNumber: 'POL-2025-0008', serialNumber: 'JD8R410-2023-5678', warrantyExpiry: '2026-09-01',
    createdAt: '2025-04-01T08:00:00Z', updatedAt: '2025-04-01T08:00:00Z' },
  { id: 'ast-005', assetNumber: 'AST-2025-0005', name: '2023 Honda CR-V', type: 'VEHICLE', status: 'ACTIVE',
    description: 'Blue Honda CR-V EX-L AWD', value: 34000, purchaseDate: '2023-11-20', purchasePrice: 38500,
    location: 'Chicago, IL', ownerId: 'holder-007', ownerName: 'Amanda Foster',
    serialNumber: '7FARW2H89PE123789',
    createdAt: '2025-07-01T10:00:00Z', updatedAt: '2025-07-01T10:00:00Z' },
];

export const MOCK_PARTNERS = [
  { id: 'partner-001', partnerNumber: 'PTR-2025-0001', name: 'Williams Insurance Agency', type: 'AGENCY', status: 'ACTIVE',
    email: 'contact@williamsinsurance.com', phone: '+1 (555) 111-2222', address: '789 Business Blvd, Springfield, IL',
    contactPerson: 'Sarah Williams', commissionRate: 8.5, totalPolicies: 45, totalPremium: 285000,
    joinedDate: '2022-01-15', createdAt: '2022-01-15T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z' },
  { id: 'partner-002', partnerNumber: 'PTR-2025-0002', name: 'Chen & Associates Brokerage', type: 'BROKER', status: 'ACTIVE',
    email: 'david@chenassociates.com', phone: '+1 (555) 222-3333', address: '321 Finance Street, Chicago, IL',
    contactPerson: 'David Chen', commissionRate: 10.0, totalPolicies: 62, totalPremium: 520000,
    joinedDate: '2021-06-01', createdAt: '2021-06-01T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z' },
  { id: 'partner-003', partnerNumber: 'PTR-2025-0003', name: 'Anderson Risk Management', type: 'BROKER', status: 'ACTIVE',
    email: 'lisa@andersonrisk.com', phone: '+1 (555) 333-4444', address: '654 Corporate Ave, Naperville, IL',
    contactPerson: 'Lisa Anderson', commissionRate: 9.0, totalPolicies: 28, totalPremium: 380000,
    joinedDate: '2023-03-01', createdAt: '2023-03-01T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z' },
  { id: 'partner-004', partnerNumber: 'PTR-2025-0004', name: 'Midwest Claims Services', type: 'SERVICE_PROVIDER', status: 'ACTIVE',
    email: 'claims@midwestclaims.com', phone: '+1 (555) 444-5555', address: '987 Industrial Park, Peoria, IL',
    contactPerson: 'Tom Bradley', commissionRate: 5.0, totalPolicies: 0, totalPremium: 0,
    joinedDate: '2023-09-15', createdAt: '2023-09-15T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z' },
];

export const MOCK_INVOICES = [
  { id: 'inv-001', invoiceNumber: 'INV-2025-0001', policyId: 'pol-001', policyNumber: 'POL-2025-0001',
    holderId: 'holder-001', holderName: 'Michael Thompson', holderEmail: 'michael.thompson@email.com',
    status: 'PAID', amount: 1200, tax: 96, totalAmount: 1296, dueDate: '2025-01-31', paidDate: '2025-01-28',
    paymentMethod: 'CREDIT_CARD', description: 'Annual auto insurance premium - POL-2025-0001',
    createdAt: '2025-01-01T09:00:00Z', updatedAt: '2025-01-28T14:00:00Z' },
  { id: 'inv-002', invoiceNumber: 'INV-2025-0002', policyId: 'pol-002', policyNumber: 'POL-2025-0002',
    holderId: 'holder-002', holderName: 'Jennifer Martinez', holderEmail: 'jennifer.martinez@email.com',
    status: 'PAID', amount: 2400, tax: 192, totalAmount: 2592, dueDate: '2025-02-28', paidDate: '2025-02-25',
    paymentMethod: 'BANK_TRANSFER', description: 'Annual home insurance premium - POL-2025-0002',
    createdAt: '2025-02-01T09:00:00Z', updatedAt: '2025-02-25T11:00:00Z' },
  { id: 'inv-003', invoiceNumber: 'INV-2025-0003', policyId: 'pol-003', policyNumber: 'POL-2025-0003',
    holderId: 'holder-003', holderName: 'Robert Davis', holderEmail: 'robert.davis@email.com',
    status: 'PENDING', amount: 900, tax: 72, totalAmount: 972, dueDate: '2025-07-31',
    description: 'Quarterly health insurance premium - Q3 2025',
    createdAt: '2025-07-01T09:00:00Z', updatedAt: '2025-07-01T09:00:00Z' },
  { id: 'inv-004', invoiceNumber: 'INV-2025-0004', policyId: 'pol-005', policyNumber: 'POL-2025-0005',
    holderId: 'holder-005', holderName: 'TechStart Solutions LLC', holderEmail: 'insurance@techstart.com',
    status: 'OVERDUE', amount: 3000, tax: 240, totalAmount: 3240, dueDate: '2025-06-30',
    description: 'Quarterly business insurance premium - Q2 2025',
    createdAt: '2025-06-01T09:00:00Z', updatedAt: '2025-07-01T09:00:00Z' },
  { id: 'inv-005', invoiceNumber: 'INV-2025-0005', policyId: 'pol-004', policyNumber: 'POL-2025-0004',
    holderId: 'holder-004', holderName: 'Emily Wilson', holderEmail: 'emily.wilson@email.com',
    status: 'PAID', amount: 4800, tax: 384, totalAmount: 5184, dueDate: '2025-03-31', paidDate: '2025-03-28',
    paymentMethod: 'BANK_TRANSFER', description: 'Annual life insurance premium - POL-2025-0004',
    createdAt: '2025-03-01T09:00:00Z', updatedAt: '2025-03-28T11:00:00Z' },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const MOCK_POLICY_STATS = {
  total: 8, totalPolicies: 8, active: 6, activePolicies: 6,
  pending: 1, expired: 1, cancelled: 0,
  totalPremium: 31930, totalInsured: 4773000,
};

export const MOCK_CLAIM_STATS = {
  total: 6, totalClaims: 6,
  byStatus: {
    DRAFT: 0, SUBMITTED: 1, UNDER_REVIEW: 2, PENDING_INFO: 0,
    APPROVED: 1, PARTIALLY_APPROVED: 0, REJECTED: 1, SETTLED: 1, CLOSED: 0, APPEALED: 0,
  },
  pendingClaims: 3, totalClaimed: 279700, totalApproved: 44800, averageProcessingTime: 12,
};

export const MOCK_ASSET_STATS = {
  totalAssets: 5, total: 5, totalValue: 872500, byType: { VEHICLE: 2, REAL_ESTATE: 1, EQUIPMENT: 2 },
};

export const MOCK_EXPIRING_POLICIES = MOCK_POLICIES.filter(
  (p) => p.status === PolicyStatus.ACTIVE && new Date(p.endDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
);
