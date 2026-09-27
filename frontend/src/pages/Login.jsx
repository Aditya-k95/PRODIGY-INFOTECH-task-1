import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, UserCheck, ShieldCheck } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target if redirected from a protected route
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Client-side validation
  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      // Navigation happens in useEffect upon auth state update
    } catch (error) {
      setServerError(error.message || 'Failed to login. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for demo convenience
  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@example.com',
        password: 'Admin@1234',
        rememberMe: true
      });
    } else {
      setFormData({
        email: 'demo@example.com',
        password: 'User@1234',
        rememberMe: true
      });
    }
    setErrors({});
    setServerError('');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Log in to access your secure portal and dashboard</p>
          </div>

          {/* Tab Switcher */}
          <div className="auth-switch-tabs">
            <Link to="/login" className="auth-tab active">
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="auth-tab">
              <UserCheck size={15} />
              <span>Register</span>
            </Link>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="demo-quickfill-box">
            <div className="demo-title">
              <ShieldCheck size={14} />
              <span>Quick Demo Accounts</span>
            </div>
            <div className="demo-buttons-row">
              <button
                type="button"
                className="btn-demo-quick"
                onClick={() => fillDemoAccount('user')}
              >
                👤 Standard User
              </button>
              <button
                type="button"
                className="btn-demo-quick"
                onClick={() => fillDemoAccount('admin')}
              >
                ⚡ Admin User
              </button>
            </div>
          </div>

          {/* Alerts */}
          {serverError && <AlertBanner type="error" message={serverError} onClose={() => setServerError('')} />}
          {successMessage && <AlertBanner type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-with-icon-wrapper">
                <span className="input-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <div className="input-error-msg">{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">Password</label>
              </div>
              <div className="input-with-icon-wrapper">
                <span className="input-icon-left">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <div className="input-error-msg">{errors.password}</div>}
            </div>

            {/* Options */}
            <div className="form-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="custom-checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember this device</span>
              </label>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Secure 256-bit</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
