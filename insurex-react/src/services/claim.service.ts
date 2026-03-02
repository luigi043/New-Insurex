import api from './api';
import { Claim } from '../types/claim.types';

const mockClaims: Claim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2024-001',
    policyId: '1',
    clientId: '1',
    incidentDate: '2024-02-15',
    reportedDate: '2024-02-16',
    description: 'Vehicle accident on highway',
    claimedAmount: 15000,
    status: 'Submitted',
    type: 'VehicleAccident'
  },
  {
    id: '2',
    claimNumber: 'CLM-2024-002',
    policyId: '1',
    clientId: '1',
    incidentDate: '2024-02-10',
    reportedDate: '2024-02-11',
    description: 'Property damage from storm',
    claimedAmount: 25000,
    approvedAmount: 22000,
    status: 'Approved',
    type: 'PropertyDamage'
  },
  {
    id: '3',
    claimNumber: 'CLM-2024-003',
    policyId: '2',
    clientId: '2',
    incidentDate: '2024-02-05',
    reportedDate: '2024-02-06',
    description: 'Theft of equipment',
    claimedAmount: 8000,
    status: 'UnderReview',
    type: 'Theft'
  }
];

export const claimService = {
  async getClaims(page = 1, pageSize = 10, status?: string) {
    let filtered = mockClaims;
    if (status) filtered = mockClaims.filter(c => c.status === status);
    return {
      items: filtered,
      totalItems: filtered.length,
      page,
      pageSize
    };
  },

  async getClaim(id: string): Promise<Claim> {
    const claim = mockClaims.find(c => c.id === id);
    if (!claim) throw new Error('Claim not found');
    return claim;
  },

  async createClaim(data: any): Promise<Claim> {
    const newClaim = {
      id: String(mockClaims.length + 1),
      claimNumber: `CLM-2024-${String(mockClaims.length + 1).padStart(3, '0')}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      ...data
    };
    mockClaims.push(newClaim);
    return newClaim;
  },

  async processClaim(id: string, data: any): Promise<Claim> {
    const index = mockClaims.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Claim not found');
    mockClaims[index] = { ...mockClaims[index], ...data };
    return mockClaims[index];
  }
};
