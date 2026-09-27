// API Service Layer - Centralized HTTP client for backend communication

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom fetch wrapper with automatic JWT Authorization header injection and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Retrieve token from storage
  const token = localStorage.getItem('prodigy_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If token expired or invalid, auto clear local session
      if (response.status === 401 && token) {
        localStorage.removeItem('prodigy_auth_token');
        localStorage.removeItem('prodigy_auth_user');
      }

      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    // Network or connection failure
    const netError = new Error('Cannot connect to authentication server. Please ensure the backend is running.');
    netError.status = 503;
    throw netError;
  }
}

// Authentication API endpoints
export const authAPI = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),
  changePassword: (passwords) => request('/auth/change-password', { method: 'PUT', body: passwords }),
};

// Dashboard & Protected API endpoints
export const dashboardAPI = {
  getSummary: () => request('/dashboard/summary', { method: 'GET' }),
  getAdminUsers: () => request('/dashboard/admin/users', { method: 'GET' }),
};

// Health Check API
export const healthAPI = {
  check: () => request('/health', { method: 'GET' }),
};

export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  health: healthAPI,
};
