import axios from 'axios';
import { getToken } from './storage';
import API_URL from '../config/Api_url'; // Assuming you have a config file for API URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
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

// API error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Handle unauthorized
        // You could redirect to login or refresh token
      }
      if (status === 500) {
        // Handle server errors
      }
    }
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  
  // User endpoints
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (data) => api.put('/users/profile', data),
  
  // Service endpoints
  getServices: () => api.get('/services'),
  getServiceDetails: (id) => api.get(`/services/${id}`),
  
  // Booking endpoints
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookings: () => api.get('/bookings'),
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  
  // Provider endpoints
  getProviders: (filters) => api.get('/providers', { params: filters }),
  getProviderDetails: (id) => api.get(`/providers/${id}`),
  
  // Reviews
  createReview: (data) => api.post('/reviews', data),
  getReviews: (providerId) => api.get(`/reviews`, { params: { providerId } }),
};

export default apiService;
