import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Shield, KeyRound, Check, Lock, Eye, EyeOff, Save } from 'lucide-react';
import AlertBanner from '../components/AlertBanner';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

const Profile = () => {
  const { user, updateUserData } = useAuth();

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileAlert, setProfileAlert] = useState({ type: '', message: '' });

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState({ type: '', message: '' });

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileAlert({ type: '', message: '' });

    if (!profileForm.name.trim() || profileForm.name.trim().length < 2) {
      setProfileAlert({ type: 'error', message: 'Full name must be at least 2 characters.' });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      if (res.success) {
        updateUserData(res.user);
        setProfileAlert({ type: 'success', message: 'Profile information updated successfully!' });
      }
    } catch (err) {
      setProfileAlert({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordAlert({ type: '', message: '' });

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordAlert({ type: 'error', message: 'Please fill in all password fields.' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordAlert({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordAlert({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (res.success) {
        setPasswordAlert({ type: 'success', message: 'Password updated successfully! Please use it for your next login.' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    } catch (err) {
      setPasswordAlert({ type: 'error', message: err.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>User Settings & Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal details, bio, and security credentials</p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Details Form */}
        <div className="content-card">
          <div className="card-header-clean">
            <h3>
              <User size={20} color="var(--primary)" />
              <span>Personal Information</span>
            </h3>
          </div>
          <div className="card-body-clean">
            {profileAlert.message && (
              <AlertBanner
                type={profileAlert.type}
                message={profileAlert.message}
                onClose={() => setProfileAlert({ type: '', message: '' })}
              />
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address (Read-Only)</label>
                <div className="input-with-icon-wrapper">
                  <span className="input-icon-left">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="form-input"
                    value={user?.email || ''}
                    disabled
                    style={{ backgroundColor: 'var(--bg-card-alt)', cursor: 'not-allowed' }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email address is permanently linked to your account.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <div className="input-with-icon-wrapper">
                  <span className="input-icon-left">
                    <User size={18} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bio">About / Bio</label>
                <textarea
                  id="bio"
                  className="form-textarea no-icon"
                  rows="3"
                  placeholder="Share a short bio..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-color)', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={profileLoading}
              >
                {profileLoading ? <div className="spinner" /> : <Save size={16} />}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="content-card">
          <div className="card-header-clean">
            <h3>
              <KeyRound size={20} color="var(--primary)" />
              <span>Change Password</span>
            </h3>
          </div>
          <div className="card-body-clean">
            {passwordAlert.message && (
              <AlertBanner
                type={passwordAlert.type}
                message={passwordAlert.message}
                onClose={() => setPasswordAlert({ type: '', message: '' })}
              />
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                <div className="input-with-icon-wrapper">
                  <span className="input-icon-left">
                    <Lock size={18} />
                  </span>
                  <input
                    id="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter existing password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <div className="input-with-icon-wrapper">
                  <span className="input-icon-left">
                    <Lock size={18} />
                  </span>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Minimum 6 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <PasswordStrengthMeter password={passwordForm.newPassword} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
                <div className="input-with-icon-wrapper">
                  <span className="input-icon-left">
                    <Lock size={18} />
                  </span>
                  <input
                    id="confirmNewPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-type new password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-secondary btn-block"
                disabled={passwordLoading}
              >
                {passwordLoading ? <div className="spinner spinner-primary" /> : <KeyRound size={16} />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
