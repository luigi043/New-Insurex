import api from './api';

// Mock data for testing
const mockPolicies = [
  {
    id: '1',
    policyNumber: 'POL-001',
    name: 'Commercial Vehicle Insurance',
    description: 'Fleet insurance for company vehicles',
    type: 'Vehicle',
    coverageAmount: 500000,
    premium: 15000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Active',
    clientId: '1',
    client: {
      id: '1',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@email.com'
    }
  },
  {
    id: '2',
    policyNumber: 'POL-002',
    name: 'Property Insurance',
    description: 'Commercial building insurance',
    type: 'Property',
    coverageAmount: 1000000,
    premium: 25000,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'Active',
    clientId: '2',
    client: {
      id: '2',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria@email.com'
    }
  }
];

export const policyService = {
  async getPolicies(page = 1, pageSize = 10, filters?: any) {
    return {
      data: {
        items: mockPolicies,
        totalItems: mockPolicies.length,
        page,
        pageSize,
        totalPages: 1,
        hasNext: false
      }
    };
  },

  async getPolicy(id: string) {
    const policy = mockPolicies.find(p => p.id === id);
    if (!policy) throw new Error('Policy not found');
    return { data: policy };
  },

  async createPolicy(data: any) {
    const newPolicy = {
      id: String(mockPolicies.length + 1),
      ...data,
      client: { firstName: 'Novo', lastName: 'Cliente', email: 'cliente@email.com' }
    };
    mockPolicies.push(newPolicy);
    return { data: newPolicy };
  },

  async updatePolicy(id: string, data: any) {
    const index = mockPolicies.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Policy not found');
    mockPolicies[index] = { ...mockPolicies[index], ...data };
    return { data: mockPolicies[index] };
  },

  async deletePolicy(id: string) {
    const index = mockPolicies.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Policy not found');
    mockPolicies.splice(index, 1);
    return { data: {} };
  }
};
