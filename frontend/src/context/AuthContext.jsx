import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on first mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('prodigy_auth_token');
      const storedUser = localStorage.getItem('prodigy_auth_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token validity by calling /auth/me
          const response = await authAPI.getMe();
          if (response.success && response.user) {
            setUser(response.user);
            localStorage.setItem('prodigy_auth_user', JSON.stringify(response.user));
          }
        } catch (error) {
          console.warn('Stored session invalid or expired:', error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    if (response.success && response.token) {
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('prodigy_auth_token', response.token);
      localStorage.setItem('prodigy_auth_user', JSON.stringify(response.user));
    }
    return response;
  };

  // Registration handler
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    if (response.success && response.token) {
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('prodigy_auth_token', response.token);
      localStorage.setItem('prodigy_auth_user', JSON.stringify(response.user));
    }
    return response;
  };

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('prodigy_auth_token');
    localStorage.removeItem('prodigy_auth_user');
  }, []);

  // Update user profile in state & localStorage
  const updateUserData = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('prodigy_auth_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  // Refresh profile from backend
  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('prodigy_auth_user', JSON.stringify(response.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserData,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for convenient consumption of AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
