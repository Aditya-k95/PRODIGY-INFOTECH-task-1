import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * ProtectedRoute component that enforces client-side authentication and role-based access
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fullscreen-loader">
        <div className="spinner spinner-primary" style={{ width: '36px', height: '36px' }}></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Verifying secure session...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login page with preserved target route
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required (e.g. admin) and user lacks it
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="dashboard-container" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <div className="content-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>
            <ShieldAlert size={48} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            This page requires <strong>{requiredRole.toUpperCase()}</strong> privileges. You are currently logged in as a <strong>{user?.role}</strong>.
          </p>
          <a href="/dashboard" className="btn btn-primary">Return to Dashboard</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
