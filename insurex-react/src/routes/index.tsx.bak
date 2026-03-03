import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/auth/PrivateRoute';
import { 
  AdminRoute, 
  InsurerRoute, 
  BrokerRoute, 
  ViewerRoute,
  UnderwriterRoute,
  ClaimsProcessorRoute,
  AccountantRoute 
} from '../components/auth/RoleBasedRoute';

// Layout
import MainLayout from '../components/layout/MainLayout';

// Auth Pages
import Login from '../modules/auth/pages/Login';
import Register from '../modules/auth/pages/Register';
import ForgotPassword from '../modules/auth/pages/ForgotPassword';
import ResetPassword from '../modules/auth/pages/ResetPassword';

// Dashboard
import Dashboard from '../modules/dashboard/pages/Dashboard';

// Policy Pages
import PolicyList from '../modules/policy/pages/PolicyList';
import PolicyCreate from '../modules/policy/pages/PolicyCreate';
import PolicyEdit from '../modules/policy/pages/PolicyEdit';
import PolicyDetail from '../modules/policy/pages/PolicyDetail';

// Asset Pages
import AssetList from '../modules/asset/pages/AssetList';
import AssetCreate from '../modules/asset/pages/AssetCreate';
import AssetEdit from '../modules/asset/pages/AssetEdit';
import AssetDetail from '../modules/asset/pages/AssetDetail';

// Claim Pages
import ClaimList from '../modules/claim/pages/ClaimList';
import ClaimCreate from '../modules/claim/pages/ClaimCreate';
import ClaimDetail from '../modules/claim/pages/ClaimDetail';

// Partner Pages
import PartnerList from '../modules/partner/pages/PartnerList';
import PartnerCreate from '../modules/partner/pages/PartnerCreate';
import PartnerEdit from '../modules/partner/pages/PartnerEdit';
import PartnerDetail from '../modules/partner/pages/PartnerDetail';

// Billing Pages
import BillingList from '../modules/billing/pages/BillingList';
import InvoiceDetail from '../modules/billing/pages/InvoiceDetail';
import PaymentRecord from '../modules/billing/pages/PaymentRecord';

// Admin Pages
import UserManagement from '../modules/admin/pages/UserManagement';
import TenantSettings from '../modules/admin/pages/TenantSettings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        {/* Dashboard - All authenticated users */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Policy Routes */}
        <Route path="/policies" element={<ViewerRoute><PolicyList /></ViewerRoute>} />
        <Route path="/policies/create" element={<BrokerRoute><PolicyCreate /></BrokerRoute>} />
        <Route path="/policies/:id" element={<ViewerRoute><PolicyDetail /></ViewerRoute>} />
        <Route path="/policies/:id/edit" element={<InsurerRoute><PolicyEdit /></InsurerRoute>} />
        
        {/* Asset Routes */}
        <Route path="/assets" element={<ViewerRoute><AssetList /></ViewerRoute>} />
        <Route path="/assets/create" element={<BrokerRoute><AssetCreate /></BrokerRoute>} />
        <Route path="/assets/:id" element={<ViewerRoute><AssetDetail /></ViewerRoute>} />
        <Route path="/assets/:id/edit" element={<InsurerRoute><AssetEdit /></InsurerRoute>} />
        
        {/* Claim Routes */}
        <Route path="/claims" element={<ViewerRoute><ClaimList /></ViewerRoute>} />
        <Route path="/claims/create" element={<BrokerRoute><ClaimCreate /></BrokerRoute>} />
        <Route path="/claims/:id" element={<ClaimsProcessorRoute><ClaimDetail /></ClaimsProcessorRoute>} />
        
        {/* Partner Routes */}
        <Route path="/partners" element={<InsurerRoute><PartnerList /></InsurerRoute>} />
        <Route path="/partners/create" element={<InsurerRoute><PartnerCreate /></InsurerRoute>} />
        <Route path="/partners/:id" element={<InsurerRoute><PartnerDetail /></InsurerRoute>} />
        <Route path="/partners/:id/edit" element={<InsurerRoute><PartnerEdit /></InsurerRoute>} />
        
        {/* Billing Routes */}
        <Route path="/billing" element={<AccountantRoute><BillingList /></AccountantRoute>} />
        <Route path="/billing/:id" element={<AccountantRoute><InvoiceDetail /></AccountantRoute>} />
        <Route path="/billing/:id/payment" element={<AccountantRoute><PaymentRecord /></AccountantRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><TenantSettings /></AdminRoute>} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
