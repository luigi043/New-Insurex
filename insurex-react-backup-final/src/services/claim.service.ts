import api from './api';

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policy?: any;
  clientId: string;
  client?: any;
  incidentDate: string;
  reportedDate: string;
  description: string;
  incidentLocation?: string;
  claimedAmount: number;
  approvedAmount?: number;
  status: string;
  type: string;
  reviewedAt?: string;
  reviewedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  paymentReference?: string;
  rejectionReason?: string;
}

export const claimService = {
  // Get all claims with pagination
  getClaims: (page: number = 1, pageSize: number = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(status && { status }),
    });
    return api.get(`/claims?${params}`);
  },

  // Get claim by ID
  getClaim: (id: string) => {
    return api.get<Claim>(`/claims/${id}`);
  },

  // Get claim by number
  getClaimByNumber: (claimNumber: string) => {
    return api.get<Claim>(`/claims/number/${claimNumber}`);
  },

  // Get claims by policy
  getClaimsByPolicy: (policyId: string) => {
    return api.get<Claim[]>(`/claims/policy/${policyId}`);
  },

  // Get claims by client
  getClaimsByClient: (clientId: string) => {
    return api.get<Claim[]>(`/claims/client/${clientId}`);
  },

  // Get claims by status
  getClaimsByStatus: (status: string) => {
    return api.get<Claim[]>(`/claims/status/${status}`);
  },

  // Create claim
  createClaim: (data: Partial<Claim>) => {
    return api.post<Claim>('/claims', data);
  },

  // Update claim
  updateClaim: (id: string, data: Partial<Claim>) => {
    return api.put<Claim>(`/claims/${id}`, data);
  },

  // Update claim status
  updateClaimStatus: (id: string, status: string, reason?: string) => {
    return api.patch(`/claims/${id}/status`, { status, reason });
  },

  // Delete claim
  deleteClaim: (id: string) => {
    return api.delete(`/claims/${id}`);
  },

  // Upload claim document
  uploadDocument: (claimId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/claims/${claimId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get claim documents
  getDocuments: (claimId: string) => {
    return api.get(`/claims/${claimId}/documents`);
  },

  // Export claims to CSV
  exportClaims: (filters?: any) => {
    return api.get('/claims/export/csv', {
      params: filters,
      responseType: 'blob',
    });
  },

  // Get claim statistics
  getClaimStats: () => {
    return api.get('/claims/stats/summary');
  }
};