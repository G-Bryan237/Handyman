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

// Add auth token to requests with better error handling
api.interceptors.request.use(
  async (config) => {
    // Ensure baseURL is set on every request
    if (!config.baseURL) {
      console.warn('[API] baseURL not set on request, adding it now');
      config.baseURL = API_URL;
    }
    
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API] Error getting token:', error);
    }
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// API error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    console.error('[API] Response error:', error.message);
    
    // Handle specific error codes
    if (error.response) {
      const { status, data } = error.response;
      console.error(`[API] Server responded with status ${status}:`, data);
      
      if (status === 401) {
        // Handle unauthorized
        console.log('[API] Unauthorized access detected');
      }
      if (status === 500) {
        // Handle server errors
        console.log('[API] Server error detected');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('[API] No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('[API] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Debug API configuration
console.log('[API] API instance created with baseURL:', api.defaults.baseURL);

// API service methods
const apiService = {
  // Authentication
  login: (credentials) => {
    console.log('[API] Calling login endpoint');
    return api.post('/auth/login', credentials);
  },
  
  register: (userData) => {
    console.log('[API] Calling register endpoint with data:', JSON.stringify(userData, null, 2));
    return api.post('/auth/register', userData);
  },
  
  logout: () => api.post('/auth/logout'),
  
  // User endpoints - ensure path matches backend routes
  getUserProfile: () => {
    console.log('[API] Calling getUserProfile endpoint at /auth/profile');
    return api.get('/auth/profile');
  },
  
  updateUserProfile: (data) => {
    console.log('[API] Calling updateUserProfile endpoint with data:', JSON.stringify(data));
    return api.put('/auth/profile', data);
  },
  
  // Service endpoints
  getServices: () => api.get('/services'),
  getServiceDetails: (id) => api.get(`/services/${id}`),
  
  // Booking endpoints
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookings: () => api.get('/bookings'),
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  
  // Provider endpoints - Updated to better match our provider profile implementation
  getProviders: (filters) => {
    console.log('[API] Calling getProviders endpoint with filters:', filters);
    return api.get('/providers', { params: filters });
  },
  getProviderDetails: (id) => {
    console.log(`[API] Calling getProviderDetails endpoint for provider ID: ${id}`);
    return api.get(`/providers/${id}`);
  },
  getProviderReviews: (id) => {
    console.log(`[API] Fetching reviews for provider ID: ${id}`);
    return api.get(`/providers/${id}/reviews`);
  },
  getProviderServices: (id) => {
    console.log(`[API] Fetching services for provider ID: ${id}`);
    return api.get(`/providers/${id}/services`);
  },
  
  // Reviews
  createReview: (data) => api.post('/reviews', data),
  getReviews: (providerId) => api.get(`/reviews`, { params: { providerId } }),
  
  // New provider registration
  becomeProvider: (providerData) => {
    console.log('[API] Calling becomeProvider endpoint with data:', JSON.stringify({
      ...providerData,
      profilePhotoUrl: providerData.profilePhotoUrl ? 'URL exists (not shown for brevity)' : null,
      certifications: providerData.certifications ? `${providerData.certifications.length} certifications uploaded` : []
    }, null, 2));
    
    // Change the endpoint from '/providers/register' to '/auth/provider'
    return api.post('/auth/provider', providerData);
  },
  
  // New method for uploading files directly through API if needed
  uploadFile: (file, type = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default apiService;
