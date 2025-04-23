
import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication API
export const authAPI = {
  // Register a new user
  register: async (name: string, email: string, password: string) => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we simulate registration
      console.log("Registering user", { name, email });
      
      // Simulate successful registration
      return {
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we simulate login
      console.log("Logging in user", { email });
      
      // Simulate successful login
      return {
        id: Date.now().toString(),
        name: "User " + email.split("@")[0],
        email,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("user");
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Email Setup API
export const emailSetupAPI = {
  // Create new email setup
  createSetup: async (setupData: {
    domain: string;
    provider: string;
    emailName: string;
    addUsers: boolean;
  }) => {
    try {
      const response = await api.post("/email-setup", setupData);
      return response.data;
    } catch (error) {
      console.error("Error creating email setup:", error);
      throw error;
    }
  },

  // Get all email setups
  getAllSetups: async () => {
    try {
      const response = await api.get("/email-setup");
      return response.data;
    } catch (error) {
      console.error("Error fetching email setups:", error);
      throw error;
    }
  },
};

// Email Platform Integration API
export const emailPlatformAPI = {
  // Initiate OAuth flow for Google
  connectToGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  // Initiate OAuth flow for Microsoft
  connectToMicrosoft: () => {
    window.location.href = `${API_URL}/auth/microsoft`;
  },

  // Check if user is connected to a platform
  checkConnection: async (provider: string) => {
    try {
      const response = await api.get(`/auth/status/${provider}`);
      return response.data.connected;
    } catch (error) {
      console.error(`Error checking ${provider} connection:`, error);
      return false;
    }
  },

  // Create email account on the connected platform
  createEmailAccount: async (data: {
    provider: string;
    domain: string;
    emailName: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  }) => {
    try {
      const response = await api.post('/email-accounts', data);
      return response.data;
    } catch (error) {
      console.error("Error creating email account:", error);
      throw error;
    }
  }
};

// Admin API endpoints
export const adminAPI = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  },

  // Get recent inquiries
  getInquiries: async () => {
    try {
      const response = await api.get("/admin/inquiries");
      return response.data;
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      throw error;
    }
  },

  // Get sales data
  getSales: async () => {
    try {
      const response = await api.get("/admin/sales");
      return response.data;
    } catch (error) {
      console.error("Error fetching sales data:", error);
      throw error;
    }
  },
};

export default api;
