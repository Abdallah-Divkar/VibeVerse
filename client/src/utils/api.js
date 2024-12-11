import axios from "axios";
import axiosInstance from "../api/axiosInstance";

import { getToken } from "./auth"; // Import the utility to get the token

const api = axiosInstance.create({
  baseURL: "https://api.yourapp.com", // Replace with your API base URL
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
