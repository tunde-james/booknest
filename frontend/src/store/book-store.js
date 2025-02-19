import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:7000';

axios.defaults.withCredentials = true;

export const useBookStore = create((set) => ({
  // initial state
  book: null,
  books: [],
  isLoading: false,
  error: null,
  message: null,

  // functions
  addBook: async (image, title, subtitle, author, link, review) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/book/add-book`, {
        image,
        title,
        subtitle,
        author,
        link,
        review,
      });

      const { message, book } = response.data;

      set({ book, message, isLoading: false });

      return { message, book };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error adding book.',
      });
      throw error;
    }
  },

  fetchBooks: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_BASE_URL}/api/book`);

      set({ books: response.data.books, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error fetching books.',
      });
      throw error;
    }
  },

  fetchBook: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_BASE_URL}/api/book/${id}`);

      set({ book: response.data.book, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error fetching book.',
      });
      throw error;
    }
  },

  updateBook: async (id, image, title, subtitle, author, link, review) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.put(`${API_BASE_URL}/api/book/${id}`, {
        image,
        title,
        subtitle,
        author,
        link,
        review,
      });

      const { message, book } = response.data;

      set({ book, message, isLoading: false });

      return { message, book };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error updating book.',
      });
      throw error;
    }
  },

  deleteBook: async (id) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/book/${id}`);
      const { message } = response.data;

      set({ message, isLoading: false });
      return { message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error deleting book.',
      });
      throw error;
    }
  },

  searchBooks: async (searchTerm) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/book/search?${searchTerm}`
      );

      set({ books: response.data.books, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error fetching book.',
      });
      throw error;
    }
  },
}));
