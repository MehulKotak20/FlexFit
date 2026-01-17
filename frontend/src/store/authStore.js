import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  storedToken: localStorage.getItem("token") || null,
  // Admin: localStorage.getItem("isAdmin") === "true",

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      localStorage.setItem("token", response.data.user.token);
      // localStorage.setItem("isAdmin", response.data.user.isAdmin);
      set({
        user: response.data.user,
        isAuthenticated: true,
        // isAdmin: response.data.user.isAdmin,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { user } = response.data;
      // Store token & admin status in localStorage
      localStorage.setItem("token", user.token);
      // localStorage.setItem("isAdmin", user.isAdmin ? "true" : "false");

      set({
        isAuthenticated: true,
        user: response.data.user,
        // isAdmin: user.isAdmin,
        error: null,
        isLoading: false,
      });

      console.log("Login Successful - isAdmin:", user.isAdmin);

      // 🚀 Navigate after successful login
      setTimeout(() => {
        if (user.isAdmin) {
          navigate("/Admin-Dashboard");
          console.log("navigate admin");
          // ✅ Redirect to admin
        } else {
          navigate("/"); // ✅ Redirect to user dashboard
        }
      }, 10);
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      console.error("Login Error:", error);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);

      // Remove token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    // 1️⃣ Check token from localStorage (Email/Password Login)
    let token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Send token if available
        withCredentials: true, // Include cookies in request (for Google login)
      });

      console.log("Auth check response:", response.data);

      // 2️⃣ If user is authenticated, update state
      set({
        user: response.data.user,
        isAuthenticated: true,
        isAdmin: response.data.user.isAdmin,
        isCheckingAuth: false,
      });

      // 3️⃣ If token came from cookies, store it in localStorage for consistency
      if (!token && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.log("Error in checkAuth:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");

      set({ isAuthenticated: false, isCheckingAuth: false, isAdmin: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
