import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, User, LogOut, Lock, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="nav-brand">
          <div className="brand-icon-wrapper">
            <Shield size={22} />
          </div>
          <span>AuthPortal</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <User size={17} />
                <span>Profile</span>
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <Lock size={17} />
                  <span>Admin Panel</span>
                </NavLink>
              )}

              <div className="nav-user-actions" style={{ marginLeft: '0.5rem' }}>
                <div className="user-badge-pill">
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name}
                  </span>
                  <span className={`role-tag ${user?.role}`}>
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Log out of your account"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <NavLink
                to="/login"
                className={({ isActive }) => `btn btn-secondary btn-sm ${isActive ? 'btn-outline-primary' : ''}`}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </NavLink>

              <NavLink
                to="/register"
                className="btn btn-primary btn-sm"
              >
                <UserPlus size={15} />
                <span>Create Account</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
