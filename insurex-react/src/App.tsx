import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './components/Auth/AuthProvider';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { NotificationProvider } from './components/Notifications/NotificationProvider';
import { Layout } from './components/Layout/Layout';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const PolicyList = lazy(() => import('./pages/policies/PolicyList').then(m => ({ default: m.PolicyList })));
const PolicyForm = lazy(() => import('./pages/policies/PolicyForm').then(m => ({ default: m.PolicyForm })));
const PolicyDetails = lazy(() => import('./pages/policies/PolicyDetails').then(m => ({ default: m.PolicyDetails })));
const AssetList = lazy(() => import('./pages/assets/AssetList').then(m => ({ default: m.AssetList })));
const AssetForm = lazy(() => import('./pages/assets/AssetForm').then(m => ({ default: m.AssetForm })));
const AssetDetails = lazy(() => import('./pages/assets/AssetDetails').then(m => ({ default: m.AssetDetails })));
const ClaimList = lazy(() => import('./pages/claims/ClaimList').then(m => ({ default: m.ClaimList })));
const ClaimForm = lazy(() => import('./pages/claims/ClaimForm').then(m => ({ default: m.ClaimForm })));
const ClaimDetails = lazy(() => import('./pages/claims/ClaimDetails').then(m => ({ default: m.ClaimDetails })));
const PartnerList = lazy(() => import('./pages/partners/PartnerList').then(m => ({ default: m.PartnerList })));
const PartnerForm = lazy(() => import('./pages/partners/PartnerForm').then(m => ({ default: m.PartnerForm })));
const BillingList = lazy(() => import('./pages/billing/BillingList').then(m => ({ default: m.BillingList })));
const Reports = lazy(() => import('./pages/reports/Reports').then(m => ({ default: m.Reports })));
const Profile = lazy(() => import('./pages/profile/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('./pages/settings/Settings').then(m => ({ default: m.Settings })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Private Routes */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Layout />
                    </PrivateRoute>
                  }
                >
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
                    <Route path=":id" element={<AssetDetails />} />
                    <Route path="edit/:id" element={<AssetForm />} />
                  </Route>

                  {/* Claims */}
                  <Route path="claims">
                    <Route index element={<ClaimList />} />
                    <Route path="new" element={<ClaimForm />} />
                    <Route path=":id" element={<ClaimDetails />} />
                    <Route path="edit/:id" element={<ClaimForm />} />
                  </Route>

                  {/* Partners */}
                  <Route path="partners">
                    <Route index element={<PartnerList />} />
                    <Route path="new" element={<PartnerForm />} />
                    <Route path=":id" element={<PartnerForm />} />
                  </Route>

                  {/* Billing */}
                  <Route path="billing" element={<BillingList />} />

                  {/* Reports */}
                  <Route path="reports" element={<Reports />} />

                  {/* Profile */}
                  <Route path="profile" element={<Profile />} />

                  {/* Settings */}
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
