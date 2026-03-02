import api from './api';
import { Policy, PaginatedResponse } from '../types/policy.types';

const mockPolicies: Policy[] = [
  {
    id: '1',
    policyNumber: 'POL-2024-001',
    name: 'Commercial Vehicle Insurance',
    description: 'Fleet insurance for company vehicles',
    type: 'Vehicle',
    coverageAmount: 500000,
    premium: 15000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Active',
    clientId: '1',
    client: { id: '1', email: 'joao@email.com', firstName: 'João', lastName: 'Silva', role: 'Client', status: 'Active' },
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    policyNumber: 'POL-2024-002',
    name: 'Property Insurance',
    description: 'Commercial building insurance',
    type: 'Property',
    coverageAmount: 1000000,
    premium: 25000,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'Active',
    clientId: '2',
    client: { id: '2', email: 'maria@email.com', firstName: 'Maria', lastName: 'Santos', role: 'Client', status: 'Active' },
    createdAt: '2024-02-01'
  }
];

export const policyService = {
  async getPolicies(page = 1, pageSize = 10): Promise<PaginatedResponse<Policy>> {
    return {
      items: mockPolicies,
      totalItems: mockPolicies.length,
      page,
      pageSize,
      totalPages: 1
    };
  },

  async getPolicy(id: string): Promise<Policy> {
    const policy = mockPolicies.find(p => p.id === id);
    if (!policy) throw new Error('Policy not found');
    return policy;
  },

  async createPolicy(data: any): Promise<Policy> {
    const newPolicy = {
      id: String(mockPolicies.length + 1),
      policyNumber: `POL-2024-${String(mockPolicies.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    mockPolicies.push(newPolicy);
    return newPolicy;
  },

  async updatePolicy(id: string, data: any): Promise<Policy> {
    const index = mockPolicies.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Policy not found');
    mockPolicies[index] = { ...mockPolicies[index], ...data };
    return mockPolicies[index];
  },

  async deletePolicy(id: string): Promise<void> {
    const index = mockPolicies.findIndex(p => p.id === id);
    if (index !== -1) mockPolicies.splice(index, 1);
  }
};
