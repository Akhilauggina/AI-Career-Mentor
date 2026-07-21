import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMsg = error.response?.data?.message;

    // Session expired — clear auth and redirect to login
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    // Attach a human-readable message for use in catch blocks
    if (!error.response) {
      error.userMessage =
        "Cannot reach the server. Make sure the backend is running.";
    } else if (status === 400) {
      error.userMessage = serverMsg || "Invalid request. Please check your inputs.";
    } else if (status === 401) {
      error.userMessage = "Session expired. Please log in again.";
    } else if (status === 403) {
      error.userMessage = serverMsg || "You don't have permission to do that.";
    } else if (status === 404) {
      error.userMessage = serverMsg || "Resource not found.";
    } else if (status === 429) {
      error.userMessage = "Too many requests. Please wait a moment and try again.";
    } else if (status >= 500) {
      error.userMessage = serverMsg || "Server error. Please try again in a moment.";
    } else {
      error.userMessage = serverMsg || "Something went wrong. Please try again.";
    }

    return Promise.reject(error);
  }
);

export default api;
