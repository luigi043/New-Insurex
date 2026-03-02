import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { PolicyList } from '../pages/policies/PolicyList';
import { PolicyForm } from '../pages/policies/PolicyForm';
import { PolicyDetails } from '../pages/policies/PolicyDetails';
import { AssetList } from '../pages/assets/AssetList';
import { ClaimList } from '../pages/claims/ClaimList';
import { Reports } from '../pages/reports/Reports';
import { InvoiceList } from '../pages/billing/InvoiceList';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="policies"><Route index element={<PolicyList />} /><Route path="new" element={<PolicyForm />} /><Route path=":id" element={<PolicyDetails />} /><Route path="edit/:id" element={<PolicyForm />} /></Route>
        <Route path="assets"><Route index element={<AssetList />} /></Route>
        <Route path="claims"><Route index element={<ClaimList />} /></Route>
        <Route path="reports" element={<Reports />} />
        <Route path="billing"><Route index element={<InvoiceList />} /></Route>
      </Route>
    </Routes>
  );
};
