import React, { useState, useEffect, useCallback } from 'react';
import { policyApi } from '../../services/policyApi';
import './PolicyList.css';

const PolicyList = ({ onSelectPolicy, onEditPolicy }) => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        searchTerm,
        status: statusFilter || undefined,
        policyType: typeFilter || undefined
      };
      
      const response = await policyApi.getAll(params);
      setPolicies(response.data);
      setTotalItems(response.data.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading policies');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPolicies();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await policyApi.delete(id);
        fetchPolicies();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting policy');
      }
    }
  };

  const getStatusClass = (policyStatus) => {
    switch (policyStatus) {
      case 'Active': return 'status-active';
      case 'Suspended': return 'status-suspended';
      case 'Cancelled': return 'status-cancelled';
      case 'Expired': return 'status-expired';
      default: return '';
    }
  };

  if (loading && policies.length === 0) return <div className="loading">Loading policies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="policy-list-container">
      <div className="policy-header">
        <h2>Policy Management</h2>
        <button className="btn-primary" onClick={() => onSelectPolicy({})}>
          + New Policy
        </button>
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by policy number or partner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Expired">Expired</option>
          </select>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="Personal">Personal</option>
            <option value="Business">Business</option>
          </select>
          <button type="submit" className="btn-search">Search</button>
        </form>
      </div>

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
              <th>Actions</th>
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
                  <span className={status-badge }>
                    {policy.status}
                  </span>
                </td>
                <td>
                  <span className={payment-status }>
                    {policy.paymentStatus}
                  </span>
                </td>
                <td>{policy.assetCount}</td>
                <td>
                  <button 
                    className="btn-icon" 
                    onClick={() => onEditPolicy(policy)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => onSelectPolicy(policy)}
                    title="View"
                  >
                    👁️
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => handleDelete(policy.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => setPage(p => Math.max(1, p-1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil(totalItems / pageSize)}</span>
        <button 
          onClick={() => setPage(p => p+1)}
          disabled={page >= Math.ceil(totalItems / pageSize)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PolicyList;
