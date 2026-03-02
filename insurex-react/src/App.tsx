import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import { Layout } from './components/Layout/Layout';
import { PolicyList } from './components/Policies/PolicyList';
import { PolicyForm } from './components/Policies/PolicyForm';
import { PolicyDetails } from './components/Policies/PolicyDetails';
import { AssetList } from './components/Assets/AssetList';
import { AssetForm } from './components/Assets/AssetForm';
import { AssetTypeSelector } from './components/Assets/AssetTypeSelector';
import { ClaimsList } from './components/Claims/ClaimsList';
import { ClaimForm } from './components/Claims/ClaimForm';
import { ClaimDetails } from './components/Claims/ClaimDetails';
import { ReportsDashboard } from './components/Reports/ReportsDashboard';
import { InvoiceList } from './components/Billing/InvoiceList';
import { InvoiceForm } from './components/Billing/InvoiceForm';
import { NotificationCenter } from './components/Notifications/NotificationCenter';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Policy Routes */}
          <Route path="policies">
            <Route index element={<PolicyList />} />
            <Route path="new" element={<PolicyForm />} />
            <Route path=":id" element={<PolicyDetails />} />
            <Route path="edit/:id" element={<PolicyForm />} />
          </Route>
          
          {/* Asset Routes */}
          <Route path="assets">
            <Route index element={<AssetList />} />
            <Route path="new" element={<AssetTypeSelector />} />
            <Route path="new/:type" element={<AssetForm />} />
            <Route path=":id" element={<div>Asset Details</div>} />
            <Route path="edit/:id" element={<AssetForm />} />
          </Route>
          
          {/* Claim Routes */}
          <Route path="claims">
            <Route index element={<ClaimsList />} />
            <Route path="new" element={<ClaimForm />} />
            <Route path=":id" element={<ClaimDetails />} />
            <Route path="edit/:id" element={<ClaimForm />} />
          </Route>
          
          {/* Report Routes */}
          <Route path="reports">
            <Route index element={<ReportsDashboard />} />
          </Route>
          
          {/* Billing Routes */}
          <Route path="billing">
            <Route path="invoices">
              <Route index element={<InvoiceList />} />
              <Route path="new" element={<InvoiceForm />} />
              <Route path=":id" element={<div>Invoice Details</div>} />
              <Route path="edit/:id" element={<InvoiceForm />} />
            </Route>
          </Route>
          
          {/* Notification Routes */}
          <Route path="notifications">
            <Route index element={<NotificationCenter />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;