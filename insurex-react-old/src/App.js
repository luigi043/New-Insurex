import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PolicyList from './components/Policy/PolicyList';
import { auth } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiInfo, setApiInfo] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const healthResponse = await auth.health();
      const infoResponse = await auth.info();
      setApiStatus('Connected');
      setApiInfo({
        health: healthResponse.data,
        info: infoResponse.data
      });
      setError(null);
    } catch (err) {
      setApiStatus('Disconnected');
      setError(err.message);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">InsureX</div>
          <div className="nav-menu">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/policies" className="nav-link">Policies</Link>
            <Link to="/assets" className="nav-link">Assets</Link>
            <Link to="/claims" className="nav-link">Claims</Link>
            <Link to="/reports" className="nav-link">Reports</Link>
            <span className="nav-user">
              {user.firstName} {user.lastName} ({user.role})
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </span>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/policies" element={
              <PolicyList 
                onSelectPolicy={handleViewPolicy}
                onEditPolicy={handleEditPolicy}
              />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <div className="api-status-bar">
          <span>API Status: </span>
          <span className={apiStatus === 'Connected' ? 'status-connected' : 'status-disconnected'}>
            {apiStatus}
          </span>
          {apiInfo && (
            <span className="api-info">
              | {apiInfo.info.application} v{apiInfo.info.version}
            </span>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
