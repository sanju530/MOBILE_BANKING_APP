import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.162.82:8080', // Match your backend IP
});

api.interceptors.request.use(async (config) => {
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
  console.log('Request URL:', config.baseURL + config.url); // Full URL
  return config;
}, (error) => {
  console.log('Interceptor Error:', error);
  return Promise.reject(error);
});

export default api;