import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../auth/types/auth.types';
import { policyService } from '../../policy/services/policy.service';
import { claimService } from '../../claim/services/claim.service';
import { billingService } from '../../billing/services/billing.service';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  totalClaims: number;
  pendingClaims: number;
  totalPremium: number;
  outstandingInvoices: number;
  overdueInvoices: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a dedicated dashboard API endpoint
      // For now, we'll simulate with parallel requests
      const [policyStats, claimStats, billingTotals] = await Promise.all([
        policyService.getStatistics().catch(() => ({ totalPolicies: 0, activePolicies: 0, totalPremium: 0 })),
        claimService.getStatistics().catch(() => ({ totalClaims: 0, pendingClaims: 0 })),
        billingService.getTotals().catch(() => ({ totalOutstanding: 0, totalOverdue: 0 }))
      ]);

      setStats({
        totalPolicies: policyStats.totalPolicies || 0,
        activePolicies: policyStats.activePolicies || 0,
        totalClaims: claimStats.totalClaims || 0,
        pendingClaims: claimStats.pendingClaims || 0,
        totalPremium: policyStats.totalPremium || 0,
        outstandingInvoices: billingTotals.totalOutstanding || 0,
        overdueInvoices: billingTotals.totalOverdue || 0
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const canViewPolicies = [UserRole.Admin, UserRole.Insurer, UserRole.Broker, UserRole.Viewer, UserRole.Underwriter].includes(user?.role as UserRole);
  const canViewClaims = [UserRole.Admin, UserRole.Insurer, UserRole.Broker, UserRole.Viewer, UserRole.ClaimsProcessor].includes(user?.role as UserRole);
  const canViewBilling = [UserRole.Admin, UserRole.Accountant].includes(user?.role as UserRole);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {canViewPolicies && (
          <Link to="/policies" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Policies</p>
                <p className="text-3xl font-bold text-blue-600">{formatNumber(stats?.totalPolicies || 0)}</p>
                <p className="text-sm text-green-600 mt-1">
                  {formatNumber(stats?.activePolicies || 0)} active
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {canViewClaims && (
          <Link to="/claims" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Claims</p>
                <p className="text-3xl font-bold text-orange-600">{formatNumber(stats?.totalClaims || 0)}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  {formatNumber(stats?.pendingClaims || 0)} pending
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {canViewPolicies && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Premium</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats?.totalPremium || 0)}</p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {canViewBilling && (
          <Link to="/billing" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                <p className="text-3xl font-bold text-purple-600">{formatCurrency(stats?.outstandingInvoices || 0)}</p>
                {stats?.overdueInvoices > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {formatCurrency(stats.overdueInvoices)} overdue
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {[UserRole.Admin, UserRole.Broker].includes(user?.role as UserRole) && (
            <Link
              to="/policies/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Policy
            </Link>
          )}
          {[UserRole.Admin, UserRole.Broker].includes(user?.role as UserRole) && (
            <Link
              to="/claims/create"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Claim
            </Link>
          )}
          {[UserRole.Admin, UserRole.Accountant].includes(user?.role as UserRole) && (
            <Link
              to="/billing/create"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Invoice
            </Link>
          )}
          {[UserRole.Admin, UserRole.Insurer].includes(user?.role as UserRole) && (
            <Link
              to="/partners/create"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Partner
            </Link>
          )}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Activity feed coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
