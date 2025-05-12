import { create } from 'zustand';
import { UserRole } from '@/lib/api/authApi'; // Updated import path
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  checkAuthStatus
} from '@/lib/api/authApi'; // Updated import path

interface UserData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  userData: UserData | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    phone?: string,
    address?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: false,
  userData: null,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await loginUser({ email, password });
      
      set({
        isLoggedIn: true,
        userData: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, role, phone, address) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await registerUser({
        name,
        email,
        password,
        role,
        phone,
        address,
      });
      
      set({
        isLoggedIn: true,
        userData: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
      set({ isLoggedIn: false, userData: null });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { isLoggedIn, userData } = await checkAuthStatus();
      set({ isLoggedIn, userData });
    } catch (error) {
      console.error("Error checking auth status:", error);
      set({ isLoggedIn: false, userData: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
