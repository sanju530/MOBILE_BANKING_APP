import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://192.168.43.134:8080', // Replace with your backend IP
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.config.method.toUpperCase()}] ${response.config.url}:`, {
      status: response.status,
      data: response.data,
    });
    if (response.data === undefined || response.data === null) {
      console.warn('Empty response data received');
      return { ...response, data: {} };
    }
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      console.log('Authentication error - removing token');
      await AsyncStorage.removeItem('token');
    } else if (error.response?.status === 500) {
      console.error('Server error (500) - check backend logs');
    } else if (!error.response) {
      console.error('Network error - check your connection');
    }
    return Promise.reject(error);
  },
);

// Request interceptor to add auth headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Interceptor - Added Authorization header with token');
      }
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        config.headers['User-Id'] = userId;
        console.log('Interceptor - Added User-Id header:', userId);
      }
      console.log(`API Request [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`);
      return config;
    } catch (error) {
      console.error('Request Interceptor Error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// Helper function to validate response data
export const validateResponse = (response, expectedType = 'object') => {
  if (!response || !response.data) {
    console.warn('Invalid response format');
    return false;
  }
  if (expectedType === 'array' && !Array.isArray(response.data)) {
    console.warn('Expected array but got:', typeof response.data);
    return false;
  }
  if (expectedType === 'object' && (typeof response.data !== 'object' || Array.isArray(response.data))) {
    console.warn('Expected object but got:', typeof response.data);
    return false;
  }
  return true;
};

export default api;