import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { ShieldCheck, Users, Search, RefreshCw, Lock, UserCheck, Calendar } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchAdminData = async () => {
    setLoading(true);
    setAlert({ type: '', message: '' });
    try {
      const res = await dashboardAPI.getAdminUsers();
      if (res.success) {
        setUsers(res.users);
        setStats(res.stats);
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to fetch admin data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="role-tag admin">Administrator Portal</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>User Management Registry</h1>
          <p style={{ color: 'var(--text-muted)' }}>RBAC Protected view: Manage and monitor all registered accounts</p>
        </div>

        <button
          onClick={fetchAdminData}
          className="btn btn-secondary btn-sm"
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'spinner spinner-primary' : ''} />
          <span>Refresh Database</span>
        </button>
      </div>

      {alert.message && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}

      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon-box blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Accounts</div>
            <div className="stat-value">{stats?.totalUsers || users.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box purple">
            <Lock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Administrators</div>
            <div className="stat-value">{stats?.adminUsers || users.filter(u => u.role === 'admin').length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box green">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Standard Users</div>
            <div className="stat-value">{stats?.standardUsers || users.filter(u => u.role === 'user').length}</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="content-card">
        <div className="card-header-clean" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Registered User Directory ({filteredUsers.length})</h3>
          </div>

          {/* Search box */}
          <div className="input-with-icon-wrapper" style={{ width: '260px' }}>
            <span className="input-icon-left">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name, email..."
              className="form-input"
              style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body-clean" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner spinner-primary" style={{ margin: '0 auto 1rem auto', width: '32px', height: '32px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Loading user directory from secure SQLite database...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No accounts match your search filter.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User Profile</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Account Created</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{u.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: u.role === 'admin' ? '#f3e8ff' : '#dbeafe',
                              color: u.role === 'admin' ? '#7e22ce' : '#1d4ed8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.bio || 'Standard User'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>
                        <span className={`role-tag ${u.role}`}>{u.role}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.last_login ? new Date(u.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
