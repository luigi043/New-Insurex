import { User, UserRole } from '../../types/auth.types';
import { Policy, PolicyType, PolicyStatus } from '../../types/policy.types';
import { Claim, ClaimStatus, ClaimType } from '../../types/claim.types';

// ---- Demo Users -------------------------------------------------------------

export const DEMO_ADMIN: User = {
  id: 'demo-user-001',
  email: 'admin@insurex.co.za',
  firstName: 'Thabo',
  lastName: 'Nkosi',
  role: UserRole.Admin,
  isActive: true,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
  lastLogin: new Date().toISOString(),
  phone: '+27 11 123 4567',
  position: 'System Administrator',
  department: 'IT Operations',
  company: 'InsureX South Africa',
};

export const DEMO_EMPLOYEE: User = {
  id: 'demo-user-002',
  email: 'employee@insurex.co.za',
  firstName: 'Nomsa',
  lastName: 'Dlamini',
  role: UserRole.Employee,
  isActive: true,
  createdAt: '2024-03-10T08:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
  lastLogin: new Date().toISOString(),
  phone: '+27 21 456 7890',
  position: 'Insurance Officer',
  department: 'Policy Management',
  company: 'InsureX South Africa',
};

export const DEMO_CLIENT: User = {
  id: 'demo-user-003',
  email: 'client@insurex.co.za',
  firstName: 'Sipho',
  lastName: 'Mthembu',
  role: UserRole.Client,
  isActive: true,
  createdAt: '2024-06-20T08:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
  lastLogin: new Date().toISOString(),
  phone: '+27 31 789 0123',
  position: 'Policy Holder',
  department: '',
  company: 'Mthembu Enterprises (Pty) Ltd',
};

export const DEMO_USER = DEMO_ADMIN;

export const DEMO_AUTH_RESPONSE = {
  user: DEMO_ADMIN,
  accessToken: 'demo-access-token-insurex-2025',
  refreshToken: 'demo-refresh-token-insurex-2025',
};

export const DEMO_AUTH_EMPLOYEE = {
  user: DEMO_EMPLOYEE,
  accessToken: 'demo-access-token-employee-2025',
  refreshToken: 'demo-refresh-token-employee-2025',
};

export const DEMO_AUTH_CLIENT = {
  user: DEMO_CLIENT,
  accessToken: 'demo-access-token-client-2025',
  refreshToken: 'demo-refresh-token-client-2025',
};

// ---- Mock Policies ----------------------------------------------------------

export const MOCK_POLICIES: Policy[] = [
  {
    id: 'pol-001', policyNumber: 'POL-2025-0001', type: PolicyType.AUTO, status: PolicyStatus.ACTIVE,
    holderId: 'holder-001', holderName: 'Michael van der Merwe', holderEmail: 'michael.vdmerwe@email.co.za',
    holderPhone: '+27 82 234 5678', insuredAmount: 320000, premium: 1850,
    startDate: '2025-01-01', endDate: '2026-01-01', deductible: 3500,
    coverageDetails: [
      { id: 'cov-001', name: 'Comprehensive Cover', description: 'Full comprehensive vehicle cover', amount: 320000, premium: 1100 },
      { id: 'cov-002', name: 'Third Party', description: 'Third-party liability cover', amount: 1000000, premium: 450 },
      { id: 'cov-003', name: 'Roadside Assist', description: '24/7 roadside assistance', amount: 0, premium: 300 },
    ],
    notes: 'Premium client - 5-year no-claim history',
    createdAt: '2024-12-15T09:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-001', agentName: 'Sarah Williams',
  },
  {
    id: 'pol-002', policyNumber: 'POL-2025-0002', type: PolicyType.HOME, status: PolicyStatus.ACTIVE,
    holderId: 'holder-002', holderName: 'Jennifer Botha', holderEmail: 'jennifer.botha@email.co.za',
    holderPhone: '+27 83 345 6789', insuredAmount: 2800000, premium: 3200,
    startDate: '2025-02-01', endDate: '2026-02-01', deductible: 7500,
    coverageDetails: [
      { id: 'cov-004', name: 'Building Structure', description: 'Building and structure coverage', amount: 2800000, premium: 2000 },
      { id: 'cov-005', name: 'Home Contents', description: 'Personal property coverage', amount: 450000, premium: 900 },
      { id: 'cov-006', name: 'Personal Liability', description: 'Personal liability cover', amount: 2000000, premium: 300 },
    ],
    notes: 'New construction - 2023 build, Sandton',
    createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-02-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-002', agentName: 'David Pretorius',
  },
  {
    id: 'pol-003', policyNumber: 'POL-2025-0003', type: PolicyType.HEALTH, status: PolicyStatus.ACTIVE,
    holderId: 'holder-003', holderName: 'Robert Dlamini', holderEmail: 'robert.dlamini@email.co.za',
    holderPhone: '+27 84 456 7890', insuredAmount: 3000000, premium: 4200,
    startDate: '2025-01-01', endDate: '2026-01-01', deductible: 10000,
    coverageDetails: [
      { id: 'cov-007', name: 'Hospitalisation', description: 'In-patient hospital coverage', amount: 3000000, premium: 2500 },
      { id: 'cov-008', name: 'Outpatient', description: 'Outpatient medical coverage', amount: 250000, premium: 1200 },
      { id: 'cov-009', name: 'Dental and Optical', description: 'Dental and optical care', amount: 50000, premium: 500 },
    ],
    createdAt: '2024-12-01T08:00:00Z', updatedAt: '2025-01-01T00:00:00Z', createdBy: 'demo-user-001',
  },
  {
    id: 'pol-004', policyNumber: 'POL-2025-0004', type: PolicyType.LIFE, status: PolicyStatus.ACTIVE,
    holderId: 'holder-004', holderName: 'Emily Mokoena', holderEmail: 'emily.mokoena@email.co.za',
    holderPhone: '+27 85 567 8901', insuredAmount: 5000000, premium: 6500,
    startDate: '2025-03-01', endDate: '2055-03-01',
    coverageDetails: [
      { id: 'cov-010', name: 'Term Life Cover', description: '30-year term life insurance', amount: 5000000, premium: 6500 },
    ],
    beneficiaries: [
      { id: 'ben-001', name: 'James Mokoena', relationship: 'Spouse', percentage: 60, contactInfo: 'james.mokoena@email.co.za' },
      { id: 'ben-002', name: 'Lerato Mokoena', relationship: 'Child', percentage: 40, contactInfo: '' },
    ],
    createdAt: '2025-02-15T11:00:00Z', updatedAt: '2025-03-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-001', agentName: 'Sarah Williams',
  },
  {
    id: 'pol-005', policyNumber: 'POL-2025-0005', type: PolicyType.BUSINESS, status: PolicyStatus.ACTIVE,
    holderId: 'holder-005', holderName: 'TechVenture Solutions (Pty) Ltd', holderEmail: 'insurance@techventure.co.za',
    holderPhone: '+27 11 678 9012', insuredAmount: 15000000, premium: 18500,
    startDate: '2025-01-01', endDate: '2026-01-01', deductible: 25000,
    coverageDetails: [
      { id: 'cov-011', name: 'Public Liability', description: 'Business public liability', amount: 15000000, premium: 7500 },
      { id: 'cov-012', name: 'Commercial Property', description: 'Business property coverage', amount: 3500000, premium: 6000 },
      { id: 'cov-013', name: 'Cyber Liability', description: 'Cyber security coverage', amount: 5000000, premium: 5000 },
    ],
    notes: 'Tech company - 50 employees, Rosebank',
    createdAt: '2024-11-15T09:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-003', agentName: 'Lisa Anderson',
  },
  {
    id: 'pol-006', policyNumber: 'POL-2024-0089', type: PolicyType.AUTO, status: PolicyStatus.EXPIRED,
    holderId: 'holder-006', holderName: 'Carlos Ferreira', holderEmail: 'carlos.ferreira@email.co.za',
    holderPhone: '+27 82 789 0123', insuredAmount: 185000, premium: 1450,
    startDate: '2024-01-01', endDate: '2025-01-01', deductible: 5000,
    coverageDetails: [
      { id: 'cov-014', name: 'Comprehensive Cover', description: 'Full comprehensive vehicle cover', amount: 185000, premium: 950 },
      { id: 'cov-015', name: 'Third Party', description: 'Third-party liability cover', amount: 1000000, premium: 500 },
    ],
    createdAt: '2023-12-15T09:00:00Z', updatedAt: '2025-01-01T00:00:00Z', createdBy: 'demo-user-001',
  },
  {
    id: 'pol-007', policyNumber: 'POL-2025-0007', type: PolicyType.TRAVEL, status: PolicyStatus.PENDING,
    holderId: 'holder-007', holderName: 'Amanda Fourie', holderEmail: 'amanda.fourie@email.co.za',
    holderPhone: '+27 83 890 1234', insuredAmount: 500000, premium: 850,
    startDate: '2025-08-01', endDate: '2025-08-31',
    coverageDetails: [
      { id: 'cov-016', name: 'Medical Emergency', description: 'Emergency medical coverage abroad', amount: 500000, premium: 450 },
      { id: 'cov-017', name: 'Trip Cancellation', description: 'Trip cancellation coverage', amount: 35000, premium: 280 },
      { id: 'cov-018', name: 'Baggage Loss', description: 'Lost or stolen baggage', amount: 15000, premium: 120 },
    ],
    createdAt: '2025-07-01T10:00:00Z', updatedAt: '2025-07-01T10:00:00Z', createdBy: 'demo-user-001',
  },
  {
    id: 'pol-008', policyNumber: 'POL-2025-0008', type: PolicyType.PROPERTY, status: PolicyStatus.ACTIVE,
    holderId: 'holder-008', holderName: 'Green Valley Farms (Pty) Ltd', holderEmail: 'admin@greenvalleyfarms.co.za',
    holderPhone: '+27 51 901 2345', insuredAmount: 6500000, premium: 9800,
    startDate: '2025-04-01', endDate: '2026-04-01', deductible: 15000,
    coverageDetails: [
      { id: 'cov-019', name: 'Farm Property', description: 'Farm buildings and equipment', amount: 4000000, premium: 5500 },
      { id: 'cov-020', name: 'Crop Insurance', description: 'Crop loss coverage', amount: 2500000, premium: 4300 },
    ],
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2025-04-01T00:00:00Z',
    createdBy: 'demo-user-001', agentId: 'agent-002', agentName: 'David Pretorius',
  },
];

// ---- Mock Claims ------------------------------------------------------------

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'clm-001', claimNumber: 'CLM-2025-0001', policyId: 'pol-001', policyNumber: 'POL-2025-0001',
    policyType: 'AUTO', holderId: 'holder-001', holderName: 'Michael van der Merwe',
    holderEmail: 'michael.vdmerwe@email.co.za', status: ClaimStatus.UNDER_REVIEW, type: ClaimType.ACCIDENT,
    incidentDate: '2025-06-15', reportedDate: '2025-06-16',
    description: 'Rear-end collision at the intersection of Jan Smuts Ave and Oxford Road, Johannesburg.',
    claimedAmount: 65000, deductible: 3500, location: 'Jan Smuts Ave and Oxford Rd, Johannesburg',
    assignedTo: 'demo-user-001', assignedToName: 'Thabo Nkosi',
    createdAt: '2025-06-16T09:00:00Z', updatedAt: '2025-06-17T14:00:00Z',
  },
  {
    id: 'clm-002', claimNumber: 'CLM-2025-0002', policyId: 'pol-002', policyNumber: 'POL-2025-0002',
    policyType: 'HOME', holderId: 'holder-002', holderName: 'Jennifer Botha',
    holderEmail: 'jennifer.botha@email.co.za', status: ClaimStatus.APPROVED, type: ClaimType.FIRE,
    incidentDate: '2025-05-20', reportedDate: '2025-05-20',
    description: 'Kitchen fire caused by electrical fault. Damage to kitchen and dining area.',
    claimedAmount: 320000, approvedAmount: 295000, deductible: 7500,
    location: '14 Acacia Avenue, Sandton, Johannesburg',
    assignedTo: 'demo-user-001', assignedToName: 'Thabo Nkosi',
    createdAt: '2025-05-20T16:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'clm-003', claimNumber: 'CLM-2025-0003', policyId: 'pol-003', policyNumber: 'POL-2025-0003',
    policyType: 'HEALTH', holderId: 'holder-003', holderName: 'Robert Dlamini',
    holderEmail: 'robert.dlamini@email.co.za', status: ClaimStatus.SUBMITTED, type: ClaimType.MEDICAL,
    incidentDate: '2025-07-01', reportedDate: '2025-07-03',
    description: 'Emergency appendectomy surgery. 3-day hospital stay at Netcare Milpark Hospital.',
    claimedAmount: 185000, deductible: 10000, location: 'Netcare Milpark Hospital, Johannesburg',
    createdAt: '2025-07-03T11:00:00Z', updatedAt: '2025-07-03T11:00:00Z',
  },
  {
    id: 'clm-004', claimNumber: 'CLM-2025-0004', policyId: 'pol-001', policyNumber: 'POL-2025-0001',
    policyType: 'AUTO', holderId: 'holder-001', holderName: 'Michael van der Merwe',
    holderEmail: 'michael.vdmerwe@email.co.za', status: ClaimStatus.SETTLED, type: ClaimType.THEFT,
    incidentDate: '2025-03-10', reportedDate: '2025-03-11',
    description: 'Vehicle sound system and personal items stolen from parked car in Sandton City parking.',
    claimedAmount: 22000, approvedAmount: 18500, settlementDate: '2025-04-01',
    location: 'Sandton City Shopping Centre, Johannesburg',
    createdAt: '2025-03-11T08:00:00Z', updatedAt: '2025-04-01T15:00:00Z',
  },
  {
    id: 'clm-005', claimNumber: 'CLM-2025-0005', policyId: 'pol-005', policyNumber: 'POL-2025-0005',
    policyType: 'BUSINESS', holderId: 'holder-005', holderName: 'TechVenture Solutions (Pty) Ltd',
    holderEmail: 'insurance@techventure.co.za', status: ClaimStatus.REJECTED, type: ClaimType.PROPERTY_DAMAGE,
    incidentDate: '2025-04-15', reportedDate: '2025-04-16',
    description: 'Water damage to server room. Rejected due to lack of preventive maintenance.',
    claimedAmount: 580000, deductible: 25000, location: '25 Fredman Drive, Sandton, Johannesburg',
    createdAt: '2025-04-16T09:00:00Z', updatedAt: '2025-05-10T14:00:00Z',
  },
  {
    id: 'clm-006', claimNumber: 'CLM-2025-0006', policyId: 'pol-008', policyNumber: 'POL-2025-0008',
    policyType: 'PROPERTY', holderId: 'holder-008', holderName: 'Green Valley Farms (Pty) Ltd',
    holderEmail: 'admin@greenvalleyfarms.co.za', status: ClaimStatus.UNDER_REVIEW, type: ClaimType.NATURAL_DISASTER,
    incidentDate: '2025-06-28', reportedDate: '2025-06-29',
    description: 'Severe hailstorm caused extensive damage to crops and greenhouse structures in the Free State.',
    claimedAmount: 950000, deductible: 15000, location: 'Green Valley Farms, Bloemfontein, Free State',
    assignedTo: 'demo-user-001', assignedToName: 'Thabo Nkosi',
    createdAt: '2025-06-29T10:00:00Z', updatedAt: '2025-07-01T09:00:00Z',
  },
];

// ---- Mock Assets ------------------------------------------------------------

export const MOCK_ASSETS = [
  {
    id: 'ast-001', assetNumber: 'AST-2025-0001', name: '2022 Toyota Fortuner', type: 'VEHICLE', status: 'ACTIVE',
    description: 'White Toyota Fortuner 2.8 GD-6 4x4 Auto', value: 620000, purchaseDate: '2022-03-15', purchasePrice: 680000,
    location: 'Johannesburg, Gauteng', ownerId: 'holder-001', ownerName: 'Michael van der Merwe',
    policyId: 'pol-001', policyNumber: 'POL-2025-0001', serialNumber: 'AHTFB8CD4N3123456',
    currency: 'ZAR', createdAt: '2025-01-01T09:00:00Z', updatedAt: '2025-01-01T09:00:00Z',
  },
  {
    id: 'ast-002', assetNumber: 'AST-2025-0002', name: 'Residential Property - 14 Acacia Ave, Sandton', type: 'REAL_ESTATE', status: 'ACTIVE',
    description: '4-bedroom, 3-bathroom home, 350m2, double garage, swimming pool', value: 3200000, purchaseDate: '2023-06-01', purchasePrice: 2950000,
    location: '14 Acacia Avenue, Sandton, Johannesburg, 2196', ownerId: 'holder-002', ownerName: 'Jennifer Botha',
    policyId: 'pol-002', policyNumber: 'POL-2025-0002',
    currency: 'ZAR', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'ast-003', assetNumber: 'AST-2025-0003', name: 'Dell PowerEdge Server Rack', type: 'EQUIPMENT', status: 'ACTIVE',
    description: 'Dell PowerEdge R750 Server, 32-core, 256GB RAM', value: 380000, purchaseDate: '2024-01-10', purchasePrice: 420000,
    location: '25 Fredman Drive, Sandton, Johannesburg', ownerId: 'holder-005', ownerName: 'TechVenture Solutions (Pty) Ltd',
    policyId: 'pol-005', policyNumber: 'POL-2025-0005', serialNumber: 'DELL-R750-2024-001',
    currency: 'ZAR', createdAt: '2025-01-01T08:00:00Z', updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'ast-004', assetNumber: 'AST-2025-0004', name: 'John Deere 8R Tractor', type: 'EQUIPMENT', status: 'ACTIVE',
    description: 'John Deere 8R 410 Tractor, 410 HP, GPS-guided', value: 3200000, purchaseDate: '2023-09-01', purchasePrice: 3500000,
    location: 'Green Valley Farms, Bloemfontein, Free State', ownerId: 'holder-008', ownerName: 'Green Valley Farms (Pty) Ltd',
    policyId: 'pol-008', policyNumber: 'POL-2025-0008', serialNumber: 'JD8R410-2023-5678',
    currency: 'ZAR', createdAt: '2025-04-01T08:00:00Z', updatedAt: '2025-04-01T08:00:00Z',
  },
  {
    id: 'ast-005', assetNumber: 'AST-2025-0005', name: '2023 Volkswagen Tiguan', type: 'VEHICLE', status: 'ACTIVE',
    description: 'Silver Volkswagen Tiguan 2.0 TSI 4Motion', value: 580000, purchaseDate: '2023-11-20', purchasePrice: 620000,
    location: 'Cape Town, Western Cape', ownerId: 'holder-007', ownerName: 'Amanda Fourie',
    serialNumber: 'WVGZZZ5NZPW123789',
    currency: 'ZAR', createdAt: '2025-07-01T10:00:00Z', updatedAt: '2025-07-01T10:00:00Z',
  },
];

// ---- Mock Partners ----------------------------------------------------------

export const MOCK_PARTNERS = [
  {
    id: 'partner-001', partnerNumber: 'PTR-2025-0001', name: 'Williams Insurance Agency', type: 'AGENCY', status: 'ACTIVE',
    email: 'contact@williamsinsurance.co.za', phone: '+27 11 111 2222', address: '45 Commissioner St, Johannesburg, 2001',
    contactPerson: 'Sarah Williams', commissionRate: 8.5, totalPolicies: 45, totalPremium: 2850000,
    joinedDate: '2022-01-15', createdAt: '2022-01-15T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'partner-002', partnerNumber: 'PTR-2025-0002', name: 'Pretorius and Associates Brokerage', type: 'BROKER', status: 'ACTIVE',
    email: 'david@pretoriusassociates.co.za', phone: '+27 12 222 3333', address: '12 Church Street, Pretoria, 0002',
    contactPerson: 'David Pretorius', commissionRate: 10.0, totalPolicies: 62, totalPremium: 5200000,
    joinedDate: '2021-06-01', createdAt: '2021-06-01T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'partner-003', partnerNumber: 'PTR-2025-0003', name: 'Anderson Risk Management', type: 'BROKER', status: 'ACTIVE',
    email: 'lisa@andersonrisk.co.za', phone: '+27 21 333 4444', address: '88 Bree Street, Cape Town, 8001',
    contactPerson: 'Lisa Anderson', commissionRate: 9.0, totalPolicies: 28, totalPremium: 3800000,
    joinedDate: '2023-03-01', createdAt: '2023-03-01T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'partner-004', partnerNumber: 'PTR-2025-0004', name: 'SA Claims Services', type: 'SERVICE_PROVIDER', status: 'ACTIVE',
    email: 'claims@saclaimsservices.co.za', phone: '+27 31 444 5555', address: '5 Aliwal Street, Durban, 4001',
    contactPerson: 'Tom Bradley', commissionRate: 5.0, totalPolicies: 0, totalPremium: 0,
    joinedDate: '2023-09-15', createdAt: '2023-09-15T09:00:00Z', updatedAt: '2025-06-01T10:00:00Z',
  },
];

// ---- Mock Invoices ----------------------------------------------------------

export const MOCK_INVOICES = [
  {
    id: 'inv-001', invoiceNumber: 'INV-2025-0001', policyId: 'pol-001', policyNumber: 'POL-2025-0001',
    holderId: 'holder-001', holderName: 'Michael van der Merwe', holderEmail: 'michael.vdmerwe@email.co.za',
    status: 'PAID', amount: 1850, tax: 277.50, totalAmount: 2127.50, dueDate: '2025-01-31', paidDate: '2025-01-28',
    paymentMethod: 'EFT', description: 'Annual auto insurance premium - POL-2025-0001',
    createdAt: '2025-01-01T09:00:00Z', updatedAt: '2025-01-28T14:00:00Z',
  },
  {
    id: 'inv-002', invoiceNumber: 'INV-2025-0002', policyId: 'pol-002', policyNumber: 'POL-2025-0002',
    holderId: 'holder-002', holderName: 'Jennifer Botha', holderEmail: 'jennifer.botha@email.co.za',
    status: 'PAID', amount: 3200, tax: 480, totalAmount: 3680, dueDate: '2025-02-28', paidDate: '2025-02-25',
    paymentMethod: 'EFT', description: 'Annual home insurance premium - POL-2025-0002',
    createdAt: '2025-02-01T09:00:00Z', updatedAt: '2025-02-25T11:00:00Z',
  },
  {
    id: 'inv-003', invoiceNumber: 'INV-2025-0003', policyId: 'pol-003', policyNumber: 'POL-2025-0003',
    holderId: 'holder-003', holderName: 'Robert Dlamini', holderEmail: 'robert.dlamini@email.co.za',
    status: 'PENDING', amount: 1050, tax: 157.50, totalAmount: 1207.50, dueDate: '2025-07-31',
    description: 'Quarterly health insurance premium - Q3 2025',
    createdAt: '2025-07-01T09:00:00Z', updatedAt: '2025-07-01T09:00:00Z',
  },
  {
    id: 'inv-004', invoiceNumber: 'INV-2025-0004', policyId: 'pol-005', policyNumber: 'POL-2025-0005',
    holderId: 'holder-005', holderName: 'TechVenture Solutions (Pty) Ltd', holderEmail: 'insurance@techventure.co.za',
    status: 'OVERDUE', amount: 4625, tax: 693.75, totalAmount: 5318.75, dueDate: '2025-06-30',
    description: 'Quarterly business insurance premium - Q2 2025',
    createdAt: '2025-06-01T09:00:00Z', updatedAt: '2025-07-01T09:00:00Z',
  },
  {
    id: 'inv-005', invoiceNumber: 'INV-2025-0005', policyId: 'pol-004', policyNumber: 'POL-2025-0004',
    holderId: 'holder-004', holderName: 'Emily Mokoena', holderEmail: 'emily.mokoena@email.co.za',
    status: 'PAID', amount: 6500, tax: 975, totalAmount: 7475, dueDate: '2025-03-31', paidDate: '2025-03-28',
    paymentMethod: 'EFT', description: 'Annual life insurance premium - POL-2025-0004',
    createdAt: '2025-03-01T09:00:00Z', updatedAt: '2025-03-28T11:00:00Z',
  },
];

// ---- Dashboard Stats --------------------------------------------------------

export const MOCK_POLICY_STATS = {
  total: 8, totalPolicies: 8, active: 6, activePolicies: 6,
  pending: 1, expired: 1, cancelled: 0,
  totalPremium: 46350, totalInsured: 33305000,
};

export const MOCK_CLAIM_STATS = {
  total: 6, totalClaims: 6,
  byStatus: {
    DRAFT: 0, SUBMITTED: 1, UNDER_REVIEW: 2, PENDING_INFO: 0,
    APPROVED: 1, PARTIALLY_APPROVED: 0, REJECTED: 1, SETTLED: 1, CLOSED: 0, APPEALED: 0,
  },
  pendingClaims: 3, totalClaimed: 2142000, totalApproved: 313500, averageProcessingTime: 12,
};

export const MOCK_ASSET_STATS = {
  totalAssets: 5, total: 5, totalValue: 7980000,
  byType: { VEHICLE: 2, REAL_ESTATE: 1, EQUIPMENT: 2 },
};

export const MOCK_EXPIRING_POLICIES = MOCK_POLICIES.filter(
  (p) => p.status === PolicyStatus.ACTIVE && new Date(p.endDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
);

// ---- Chart Data -------------------------------------------------------------

export const MOCK_MONTHLY_PREMIUM = [
  { month: 'Feb', premium: 38200 },
  { month: 'Mar', premium: 41500 },
  { month: 'Apr', premium: 39800 },
  { month: 'May', premium: 43200 },
  { month: 'Jun', premium: 44100 },
  { month: 'Jul', premium: 46350 },
];

export const MOCK_CLAIMS_TREND = [
  { month: 'Feb', claims: 3 },
  { month: 'Mar', claims: 5 },
  { month: 'Apr', claims: 4 },
  { month: 'May', claims: 7 },
  { month: 'Jun', claims: 6 },
  { month: 'Jul', claims: 6 },
];
