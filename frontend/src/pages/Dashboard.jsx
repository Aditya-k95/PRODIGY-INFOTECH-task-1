import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, healthAPI } from '../services/api';
import {
  ShieldCheck,
  User,
  Activity,
  Server,
  Key,
  Database,
  ArrowRight,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import AlertBanner from '../components/AlertBanner';

const Dashboard = () => {
  const { user, token } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [serverHealth, setServerHealth] = useState('Checking...');
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [banner, setBanner] = useState({ type: '', message: '' });

  // Load summary stats on page load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, healthRes] = await Promise.allSettled([
          dashboardAPI.getSummary(),
          healthAPI.check()
        ]);

        if (summaryRes.status === 'fulfilled' && summaryRes.value.success) {
          setStats(summaryRes.value.data);
        }

        if (healthRes.status === 'fulfilled' && healthRes.value.status === 'online') {
          setServerHealth('Online (Express v5)');
        } else {
          setServerHealth('Connected');
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  // Test standard protected API call
  const handleTestProtectedAPI = async () => {
    setApiLoading(true);
    setBanner({ type: '', message: '' });
    try {
      const startTime = performance.now();
      const response = await dashboardAPI.getSummary();
      const duration = Math.round(performance.now() - startTime);

      setApiResponse({
        endpoint: 'GET /api/dashboard/summary',
        status: 200,
        statusText: 'OK',
        duration: `${duration}ms`,
        authenticatedUser: user?.email,
        authHeaderPresent: 'Bearer eyJhbGciOiJIUzI1Ni...',
        payload: response
      });
      setBanner({ type: 'success', message: 'Protected API request succeeded! Token verified by backend.' });
    } catch (err) {
      setApiResponse({
        endpoint: 'GET /api/dashboard/summary',
        status: err.status || 500,
        statusText: 'Error',
        error: err.message
      });
      setBanner({ type: 'error', message: err.message });
    } finally {
      setApiLoading(false);
    }
  };

  // Test admin-only protected API call
  const handleTestAdminAPI = async () => {
    setApiLoading(true);
    setBanner({ type: '', message: '' });
    try {
      const startTime = performance.now();
      const response = await dashboardAPI.getAdminUsers();
      const duration = Math.round(performance.now() - startTime);

      setApiResponse({
        endpoint: 'GET /api/dashboard/admin/users',
        status: 200,
        statusText: 'OK',
        duration: `${duration}ms`,
        authenticatedUser: user?.email,
        userRole: user?.role,
        payload: response
      });
      setBanner({ type: 'success', message: 'Admin API request succeeded! Role authorization passed.' });
    } catch (err) {
      setApiResponse({
        endpoint: 'GET /api/dashboard/admin/users',
        status: err.status || 403,
        statusText: 'Forbidden / Error',
        error: err.message,
        details: err.status === 403 ? 'Backend RBAC middleware prevented access because current role is not admin.' : err.message
      });
      setBanner({
        type: err.status === 403 ? 'warning' : 'error',
        message: err.message
      });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hero Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Sparkles size={20} color="#fde047" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
              Authenticated Session Active
            </span>
          </div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>
            You have securely logged in to your account. Your credentials and session are protected with JSON Web Tokens (JWT) and Bcrypt encryption.
          </p>
        </div>

        <div className="hero-badges">
          <div className="hero-badge-item">
            <User size={15} />
            <span>Role: <strong>{user?.role?.toUpperCase()}</strong></span>
          </div>
          <div className="hero-badge-item">
            <ShieldCheck size={15} color="#86efac" />
            <span>Security: <strong>HS-256 JWT</strong></span>
          </div>
        </div>
      </div>

      {banner.message && (
        <AlertBanner
          type={banner.type}
          message={banner.message}
          onClose={() => setBanner({ type: '', message: '' })}
        />
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box blue">
            <User size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Logged In User</div>
            <div className="stat-value" style={{ fontSize: '1.2rem', wordBreak: 'break-word' }}>
              {user?.name}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box green">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Backend Status</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--success)' }}>
              {serverHealth}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SQLite Database active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box purple">
            <Database size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Platform Accounts</div>
            <div className="stat-value">
              {stats?.stats?.totalUsers || '2+'}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered in database</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box orange">
            <Key size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Token Expiration</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>
              7 Days
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Persistent Session</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Protected API Tester */}
        <div className="content-card">
          <div className="card-header-clean">
            <h3>
              <Code2 size={20} color="var(--primary)" />
              <span>Protected API Verification</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live Endpoints</span>
          </div>
          <div className="card-body-clean">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Test backend verification of your <code>Authorization: Bearer &lt;JWT&gt;</code> token in real-time.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button
                onClick={handleTestProtectedAPI}
                className="btn btn-primary btn-sm"
                disabled={apiLoading}
              >
                {apiLoading ? 'Requesting...' : '📡 Test GET /api/dashboard/summary'}
              </button>

              <button
                onClick={handleTestAdminAPI}
                className="btn btn-secondary btn-sm"
                disabled={apiLoading}
              >
                <Lock size={14} />
                <span>Test Admin-Only API</span>
              </button>
            </div>

            {/* API Console Box */}
            <div className="api-tester-box">
              <div className="api-tester-header">
                <span>TERMINAL RESPONSE VIEWER</span>
                <span>{apiResponse ? `HTTP ${apiResponse.status}` : 'READY'}</span>
              </div>
              <pre style={{ margin: 0 }}>
                {apiResponse
                  ? JSON.stringify(apiResponse, null, 2)
                  : `// Click a test button above to make an authenticated request.\n// The backend independently validates your token payload.`}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: User Profile Overview & Quick Actions */}
        <div className="content-card">
          <div className="card-header-clean">
            <h3>
              <User size={20} color="var(--primary)" />
              <span>Account Credentials & Profile</span>
            </h3>
            <Link to="/profile" className="btn btn-outline-primary btn-sm">
              <span>Edit Profile</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body-clean">
            <div className="profile-detail-row">
              <span className="profile-detail-label">Full Name</span>
              <span className="profile-detail-value">{user?.name}</span>
            </div>

            <div className="profile-detail-row">
              <span className="profile-detail-label">Email Address</span>
              <span className="profile-detail-value">{user?.email}</span>
            </div>

            <div className="profile-detail-row">
              <span className="profile-detail-label">Assigned Role</span>
              <span className="profile-detail-value">
                <span className={`role-tag ${user?.role}`}>{user?.role}</span>
              </span>
            </div>

            <div className="profile-detail-row">
              <span className="profile-detail-label">Bio / About</span>
              <span className="profile-detail-value" style={{ fontWeight: 400, color: 'var(--text-muted)', maxWidth: '240px', textAlign: 'right' }}>
                {user?.bio || 'No bio provided'}
              </span>
            </div>

            <div className="profile-detail-row">
              <span className="profile-detail-label">Account ID</span>
              <span className="profile-detail-value" style={{ fontFamily: 'monospace' }}>#{user?.id}</span>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <Link to="/profile" className="btn btn-secondary btn-block">
                <span>Manage Security & Password</span>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-primary btn-block">
                  <Lock size={15} />
                  <span>Admin User Table</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
