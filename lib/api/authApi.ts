import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define UserRole enum to match your backend implementation
export enum UserRole {
  USER = 'user',
  PROVIDER = 'provider'
}

// Define types and helper functions for axios errors
interface AxiosError<T = any> {
  response?: {
    data: T;
    status: number;
    headers: Record<string, string>;
  };
  request?: any;
  message: string;
  config: any;
  isAxiosError: boolean;
}

// Helper function to check if an error is an axios error
function isAxiosError(error: unknown): error is AxiosError {
  return error != null && typeof error === 'object' && 'isAxiosError' in error && (error as any).isAxiosError === true;
}

const API_URL = 'http://localhost:5000/api';

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    const token = AsyncStorage.getItem('token').then((token) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    });
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

type RegisterParams = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
};

type LoginParams = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
};

export const registerUser = async (userData: RegisterParams): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    // Store token and user data
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    await AsyncStorage.setItem('isLoggedIn', 'true');
    
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;
      throw new Error(axiosError.response?.data.error || 'Registration failed');
    }
    throw new Error('Network error during registration');
  }
};

export const loginUser = async ({ email, password }: LoginParams): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    
    // Store token and user data
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    await AsyncStorage.setItem('isLoggedIn', 'true');
    
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response) {
        throw new Error(axiosError.response.data.error || 'Login failed');
      }
    }
    throw new Error('Network error during login');
  }
};

export const logoutUser = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('userData');
  await AsyncStorage.removeItem('isLoggedIn');
};

export const checkAuthStatus = async (): Promise<{
  isLoggedIn: boolean;
  userData: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
}> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    
    if (!token || !isLoggedIn) {
      return { isLoggedIn: false, userData: null };
    }
    
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      return { isLoggedIn: false, userData: null };
    }
    
    // Optionally verify token with backend
    try {
      const response = await api.get<{ user: { id: string; name: string; email: string; role: UserRole } }>('/auth/profile');
      const updatedUserData = response.data.user;
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      return { isLoggedIn: true, userData: updatedUserData };
    } catch (error) {
      // Token is invalid or expired
      await logoutUser();
      return { isLoggedIn: false, userData: null };
    }
    
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { isLoggedIn: false, userData: null };
  }
};
