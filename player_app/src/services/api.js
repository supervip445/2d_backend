import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - Update this for your environment
const API_BASE_URL = 'http://localhost:3000/api';
// For Android emulator: 'http://10.0.2.2:3000/api'
// For iOS simulator: 'http://localhost:3000/api'
// For physical device: 'http://YOUR_COMPUTER_IP:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
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
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  playerLogin: (credentials) => api.post('/auth/player/login', credentials),
  logout: () => api.post('/auth/admin/logout'), // Using admin logout endpoint
};

// Two-Digit API
export const twoDigitAPI = {
  getAll: (params) => api.get('/two-digit/getall', { params }),
  getActive: () => api.get('/two-digit/active'),
  getInactive: () => api.get('/two-digit/inactive'),
  checkStatus: (twoDigit) => api.get(`/two-digit/status/${twoDigit}`),
};

// User API (for profile)
export const userAPI = {
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  getProfile: () => api.get('/user/profile'),
};

// Bet API (to be implemented in backend)
export const betAPI = {
  placeBet: (betData) => api.post('/bets', betData),
  getBets: (params) => api.get('/bets', { params }),
  getBetHistory: () => api.get('/bets/history'),
};

export default api;

