import axios from "axios";

// Update base URL to point to your API Gateway endpoint
const API_URL = import.meta.env.VITE_API_GATEWAY_URL || "https://your-api-gateway-url.execute-api.region.amazonaws.com/dev";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for AWS Cognito authentication
api.interceptors.request.use(async (config) => {
  try {
    // @ts-ignore
    const session = await Auth.currentSession();
    // @ts-ignore
    const token = session.getIdToken().getJwtToken();
    config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error("Auth error:", error);
    // Continue without token if auth fails
  }
  return config;
});

// Authentication API updated for AWS Cognito
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

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

// Email Setup API updated for AWS endpoints
export const emailSetupAPI = {
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

// Domain Management API with proper error handling
export const domainAPI = {
  startVerification: async (domain: string) => {
    try {
      const response = await api.post("/domain/verify", { domain });
      return response.data;
    } catch (error) {
      console.error("Error starting domain verification:", error);
      throw error;
    }
  },

  checkVerification: async (domain: string, verificationToken: string) => {
    try {
      const response = await api.post("/domain/check-verification", { 
        domain, 
        verificationToken 
      });
      return response.data;
    } catch (error) {
      console.error("Error checking domain verification:", error);
      throw error;
    }
  },
  
  setupDnsRecords: async (domain: string, provider: string, hostedZoneId?: string) => {
    try {
      const response = await api.post("/domain/setup-dns", { 
        domain,
        provider,
        hostedZoneId
      });
      return response.data;
    } catch (error) {
      console.error("Error setting up DNS records:", error);
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
