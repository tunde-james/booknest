import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:7000';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  // initial state
  user: null,
  isLoading: false,
  error: null,
  message: null,
  fetchingUser: true,

  // functions
  signup: async (username, email, password) => {
    set({ isLoading: true, message: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/my/user/signup`, {
        username,
        email,
        password,
      });

      set({ user: response.user, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error signing up.',
      });

      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, message: null, error: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/my/user/login`, {
        email,
        password,
      });

      const { user, message } = response.data;

      set({ user, isLoading: false, message });
      return { user, message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error logging in.',
      });

      throw error;
    }
  },

  fetchUser: async () => {
    set({ fetchingUser: true, error: null });

    try {
      const response = await axios.get(`${API_BASE_URL}/api/my/user/me`);

      set({ user: response.data.user, fetchingUser: false });
    } catch (error) {
      set({
        fetchingUser: false,
        error: null,
        user: null,
      });

      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/my/user/logout`);

      const { message } = response.data;

      set({ message, isLoading: false, user: null, error: null });

      return { message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error logging out.',
      });

      throw error;
    }
  },
}));
