import React, { useState, useEffect, useCallback } from 'react';
import { policyApi } from '../../services/policyApi';
import './PolicyList.css';

interface Policy {
  id: string;
  policyNumber: string;
  policyType: string;
  partnerName: string;
  startDate: string;
  endDate: string;
  premium: number;
  insuredValue: number;
  status: string;
  paymentStatus: string;
  assetCount: number;
}

interface PolicyListProps {
  onSelectPolicy?: (policy: Policy) => void;
  onEditPolicy?: (policy: Policy) => void;
}

const PolicyList: React.FC<PolicyListProps> = ({ onSelectPolicy, onEditPolicy }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await policyApi.getAll();
      setPolicies(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading policies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const getStatusClass = (policyStatus: string): string => {
    switch (policyStatus) {
      case 'Active': return 'status-active';
      case 'Suspended': return 'status-suspended';
      case 'Cancelled': return 'status-cancelled';
      case 'Expired': return 'status-expired';
      default: return '';
    }
  };

  if (loading) return <div className="loading">Loading policies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="policy-list-container">
      <h2>Policy Management</h2>
      <div className="policy-table-container">
        <table className="policy-table">
          <thead>
            <tr>
              <th>Policy Number</th>
              <th>Type</th>
              <th>Partner</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Premium</th>
              <th>Insured Value</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Assets</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.policyNumber}</td>
                <td>{policy.policyType}</td>
                <td>{policy.partnerName}</td>
                <td>{new Date(policy.startDate).toLocaleDateString()}</td>
                <td>{new Date(policy.endDate).toLocaleDateString()}</td>
                <td></td>
                <td></td>
                <td>
                  <span className={'status-badge ' + getStatusClass(policy.status)}>
                    {policy.status}
                  </span>
                </td>
                <td>
                  <span className={'payment-status ' + (policy.paymentStatus === 'Paid' ? 'paid' : 'pending')}>
                    {policy.paymentStatus}
                  </span>
                </td>
                <td>{policy.assetCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicyList;
