import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { billingService } from '../services/billing.service';
import { Invoice, InvoiceStatus } from '../types/billing.types';
import { useAuth } from '../../../hooks/useAuth';
import { UserRole } from '../../../modules/auth/types/auth.types';
import { formatCurrency, formatDate, formatDateTime } from '../../../utils/formatters';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canRecordPayment = user?.role === UserRole.Admin || user?.role === UserRole.Accountant;
  const canCancel = user?.role === UserRole.Admin;
  const canSend = user?.role === UserRole.Admin || user?.role === UserRole.Accountant;

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await billingService.getById(parseInt(id));
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!invoice) return;
    const reason = window.prompt('Enter cancellation reason:');
    if (!reason) return;

    try {
      await billingService.cancel(invoice.id, reason);
      loadInvoice();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel invoice');
    }
  };

  const handleMarkAsSent = async () => {
    if (!invoice) return;
    const email = window.prompt('Enter email to send invoice to:', invoice.sentToEmail || invoice.customerEmail);
    if (!email) return;

    try {
      await billingService.markAsSent(invoice.id, email);
      loadInvoice();
    } catch (err: any) {
      alert(err.message || 'Failed to mark invoice as sent');
    }
  };

  const getStatusBadgeClass = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Paid:
        return 'bg-green-100 text-green-800';
      case InvoiceStatus.Sent:
        return 'bg-blue-100 text-blue-800';
      case InvoiceStatus.Draft:
        return 'bg-gray-100 text-gray-800';
      case InvoiceStatus.Overdue:
        return 'bg-red-100 text-red-800';
      case InvoiceStatus.Cancelled:
        return 'bg-gray-100 text-gray-500';
      case InvoiceStatus.PartiallyPaid:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Invoice not found'}
        </div>
        <button
          onClick={() => navigate('/billing')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Billing
        </button>
      </div>
    );
  }

  const balanceDue = invoice.totalAmount - (invoice.paidAmount || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={() => navigate('/billing')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Billing
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
        </div>
        <div className="flex gap-2">
          {invoice.status === InvoiceStatus.Draft && canSend && (
            <button
              onClick={handleMarkAsSent}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Mark as Sent
            </button>
          )}
          {canRecordPayment && balanceDue > 0 && invoice.status !== InvoiceStatus.Cancelled && (
            <Link
              to={`/billing/${invoice.id}/payment`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Record Payment
            </Link>
          )}
          {canCancel && invoice.status !== InvoiceStatus.Cancelled && invoice.status !== InvoiceStatus.Paid && (
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg p-4 mb-6 ${getStatusBadgeClass(invoice.status)}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Status: {invoice.status}</span>
          {invoice.status === InvoiceStatus.Overdue && (
            <span className="text-red-700 font-medium">This invoice is overdue</span>
          )}
          {invoice.status === InvoiceStatus.Cancelled && invoice.cancellationReason && (
            <span className="text-gray-600">Reason: {invoice.cancellationReason}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{invoice.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{invoice.customerEmail}</p>
              </div>
              {invoice.customerAddress && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="text-gray-900">{invoice.customerAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Description</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Quantity</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Unit Price</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment History */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Method</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Reference</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.payments.map((payment, index) => (
                    <tr key={index}>
                      <td className="py-3 text-sm text-gray-900">{formatDate(payment.paymentDate)}</td>
                      <td className="py-3 text-sm text-gray-900">{payment.paymentMethod}</td>
                      <td className="py-3 text-sm text-gray-900">{payment.referenceNumber || '-'}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">{formatCurrency(payment.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Number</span>
                <span className="font-medium">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{invoice.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Issue Date</span>
                <span className="font-medium">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date</span>
                <span className="font-medium">{formatDate(invoice.dueDate)}</span>
              </div>
              {invoice.sentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sent Date</span>
                  <span className="font-medium">{formatDate(invoice.sentDate)}</span>
                </div>
              )}
              {invoice.sentToEmail && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sent To</span>
                  <span className="font-medium">{invoice.sentToEmail}</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              {invoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Paid</span>
                    <span>-{formatCurrency(invoice.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-blue-600">
                    <span>Balance Due</span>
                    <span>{formatCurrency(balanceDue)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Related Information */}
          {invoice.policyId && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Policy</h2>
              <Link
                to={`/policies/${invoice.policyId}`}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Policy
              </Link>
            </div>
          )}

          {invoice.claimId && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Claim</h2>
              <Link
                to={`/claims/${invoice.claimId}`}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Claim
              </Link>
            </div>
          )}

          {/* Audit Information */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p>Created by {invoice.createdBy} on {formatDateTime(invoice.createdAt)}</p>
            <p>Last updated by {invoice.updatedBy} on {formatDateTime(invoice.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
