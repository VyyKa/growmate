import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://growmate.azurewebsites.net/api';

// Initialize token from localStorage on module load
// Priority: 1) Check Redux store "auth" key, 2) Check "auth_token" key (legacy)
let authToken: string | undefined = (() => {
  try {
    // First, try to read from Redux's "auth" key (which stores { user, token, expiresAt })
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        // Check if expired
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('auth');
          return undefined;
        }
        if (parsed.token) {
          return parsed.token;
        }
      } catch {
        // If parsing fails, fall through to legacy key
      }
    }
    // Fallback to legacy "auth_token" key
    return localStorage.getItem('auth_token') || undefined;
  } catch {
    return undefined;
  }
})();

export const setAuthToken = (token?: string) => {
  authToken = token;
  // Note: Redux (authSlice) is the primary source of truth and saves to "auth" key
  // We also maintain "auth_token" as a backup for quick access by axios
  // This ensures compatibility with code that calls setAuthToken before Redux dispatch
  if (token) {
    try {
      // Keep legacy "auth_token" key as backup (for quick access)
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to save token to localStorage:', error);
    }
  } else {
    try {
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove token from localStorage:', error);
    }
  }
};

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;