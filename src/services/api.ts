
import axios from "axios";

const API_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default api;
