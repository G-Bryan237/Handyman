import axios from 'axios';
import { getToken } from './storage';

// Define default config
const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to add auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    // Check if baseURL is defined to prevent the error
    if (!config.baseURL) {
      config.baseURL = API_BASE_URL;
    }
    
    // Add auth token to headers if available
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // User related endpoints
  getUserProfile: async () => {
    try {
      return await apiClient.get('/user/profile');
    } catch (error) {
      console.error('API Error - getUserProfile:', error);
      throw error;
    }
  },
  
  // Add other API methods here
  // e.g., login, register, updateProfile, etc.
  login: async (credentials: { email: string; password: string }) => {
    try {
      return await apiClient.post('/auth/login', credentials);
    } catch (error) {
      console.error('API Error - login:', error);
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      return await apiClient.post('/auth/register', userData);
    } catch (error) {
      console.error('API Error - register:', error);
      throw error;
    }
  },
  
  // Add more methods as needed for your application
};

export default apiService;
