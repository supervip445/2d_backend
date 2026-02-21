import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://thetthetwinnerschool.online/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      // Forbidden - log error details for debugging
      console.error('403 Forbidden Error:', {
        message: error.response.data?.message,
        yourRole: error.response.data?.yourRole,
        allowedRoles: error.response.data?.allowedRoles,
        url: error.config?.url,
      });
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  playerLogin: (credentials) => api.post('/auth/player/login', credentials),
  logout: () => api.post('/auth/admin/logout'),
};

// User API
export const userAPI = {
  getUsers: () => api.get('/user/users'),
  createUser: (userData) => api.post('/user/users', userData),
  updateUser: (id, userData) => api.put(`/user/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/user/users/${id}`),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
};

// Two-Digit API
export const twoDigitAPI = {
  getAll: (params) => api.get('/two-digit/getall', { params }),
  getActive: () => api.get('/two-digit/active'),
  getInactive: () => api.get('/two-digit/inactive'),
  checkStatus: (twoDigit) => api.get(`/two-digit/status/${twoDigit}`),
  closeDigit: (twoDigit) => api.post(`/two-digit/close/${twoDigit}`),
  openDigit: (twoDigit) => api.post(`/two-digit/open/${twoDigit}`),
};

// Admin Bet API
export const adminBetAPI = {
  // Bet Slips
  getBetSlips: (params) => api.get('/admin/bet-slips', { params }),
  getBetSlipById: (id) => api.get(`/admin/bet-slips/${id}`),
  updateBetSlipStatus: (id, status) => api.put(`/admin/bet-slips/${id}/status`, { status }),
  deleteBetSlip: (id) => api.delete(`/admin/bet-slips/${id}`),
  
  // Bet Details
  getBetDetails: (params) => api.get('/admin/bet-details', { params }),
  getBetDetailById: (id) => api.get(`/admin/bet-details/${id}`),
  updateBetDetail: (id, data) => api.put(`/admin/bet-details/${id}`, data),
  deleteBetDetail: (id) => api.delete(`/admin/bet-details/${id}`),
  
  // Head Closes
  getHeadCloses: (params) => api.get('/admin/head-closes', { params }),
  getHeadCloseById: (id) => api.get(`/admin/head-closes/${id}`),
  createHeadClose: (data) => api.post('/admin/head-closes', data),
  updateHeadClose: (id, data) => api.put(`/admin/head-closes/${id}`, data),
  deleteHeadClose: (id) => api.delete(`/admin/head-closes/${id}`),
  
  // Results
  getResults: (params) => api.get('/admin/results', { params }),
  getResultById: (id) => api.get(`/admin/results/${id}`),
  createResult: (data) => api.post('/admin/results', data),
  updateResult: (id, data) => api.put(`/admin/results/${id}`, data),
  deleteResult: (id) => api.delete(`/admin/results/${id}`),
};

// Health Check
export const healthAPI = {
  check: () => axios.get(`${import.meta.env.VITE_API_URL || 'https://thetthetwinnerschool.online'}/health`),
};

export default api;

