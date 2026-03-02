import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';

// Componentes placeholder
const Policies = () => <div>Policies Page - Em construção</div>;
const Assets = () => <div>Assets Page - Em construção</div>;
const Claims = () => <div>Claims Page - Em construção</div>;
const Reports = () => <div>Reports Page - Em construção</div>;

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<div>Dashboard Page</div>} />
        <Route path="policies" element={<Policies />} />
        <Route path="assets" element={<Assets />} />
        <Route path="claims" element={<Claims />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default App;
