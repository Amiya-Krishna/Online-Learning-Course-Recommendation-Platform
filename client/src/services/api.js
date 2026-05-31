import axios from "axios";

import { STORAGE_KEY } from "../utils/storage";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem(STORAGE_KEY);

  if (storedSession) {
    const { token } = JSON.parse(storedSession);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Request failed. Please try again.";

    return Promise.reject(new Error(message));
  }
);

export { api };
