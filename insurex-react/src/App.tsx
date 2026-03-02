import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { Layout } from './components/Layout/Layout';

// Lazy loading para otimização
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const PolicyList = lazy(() => import('./pages/policies/PolicyList'));
const PolicyForm = lazy(() => import('./pages/policies/PolicyForm'));
const PolicyDetails = lazy(() => import('./pages/policies/PolicyDetails'));
const AssetList = lazy(() => import('./pages/assets/AssetList'));
const AssetForm = lazy(() => import('./pages/assets/AssetForm'));
const ClaimList = lazy(() => import('./pages/claims/ClaimList'));
const ClaimForm = lazy(() => import('./pages/claims/ClaimForm'));
const ClaimDetails = lazy(() => import('./pages/claims/ClaimDetails'));
const Reports = lazy(() => import('./pages/reports/Reports'));
const InvoiceList = lazy(() => import('./pages/billing/InvoiceList'));
const PartnerList = lazy(() => import('./pages/partners/PartnerList'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Private Routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Policies */}
          <Route path="policies">
            <Route index element={<PolicyList />} />
            <Route path="new" element={<PolicyForm />} />
            <Route path=":id" element={<PolicyDetails />} />
            <Route path="edit/:id" element={<PolicyForm />} />
          </Route>
          
          {/* Assets */}
          <Route path="assets">
            <Route index element={<AssetList />} />
            <Route path="new" element={<AssetForm />} />
            <Route path=":id" element={<div>Asset Details</div>} />
            <Route path="edit/:id" element={<AssetForm />} />
          </Route>
          
          {/* Claims */}
          <Route path="claims">
            <Route index element={<ClaimList />} />
            <Route path="new" element={<ClaimForm />} />
            <Route path=":id" element={<ClaimDetails />} />
          </Route>
          
          {/* Reports */}
          <Route path="reports" element={<Reports />} />
          
          {/* Billing */}
          <Route path="billing">
            <Route index element={<InvoiceList />} />
          </Route>
          
          {/* Partners */}
          <Route path="partners">
            <Route index element={<PartnerList />} />
          </Route>
          
          {/* User */}
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
