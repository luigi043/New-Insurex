import api from './api';

const mockClaims = [
  {
    id: '1',
    claimNumber: 'CLM-001',
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
    claimNumber: 'CLM-002',
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
    claimNumber: 'CLM-003',
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
    if (status) {
      filtered = mockClaims.filter(c => c.status === status);
    }
    return {
      data: {
        items: filtered,
        totalItems: filtered.length,
        page,
        pageSize
      }
    };
  },

  async getClaim(id: string) {
    const claim = mockClaims.find(c => c.id === id);
    return { data: claim };
  },

  async createClaim(data: any) {
    const newClaim = {
      id: String(mockClaims.length + 1),
      claimNumber: `CLM-${String(mockClaims.length + 1).padStart(3, '0')}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      ...data
    };
    mockClaims.push(newClaim);
    return { data: newClaim };
  },

  async processClaim(id: string, data: any) {
    const index = mockClaims.findIndex(c => c.id === id);
    if (index >= 0) {
      mockClaims[index] = { ...mockClaims[index], ...data };
    }
    return { data: mockClaims[index] };
  }
};
