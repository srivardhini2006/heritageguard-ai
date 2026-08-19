import axios from "axios";

// Single source of truth for the backend base URL. Never hardcode
// backend hosts inside components — everything routes through here.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Toggle for mock-vs-real data. Controlled purely by env so a build can be
// flipped to real APIs with zero code changes.
export const USE_MOCK_DATA =
  (import.meta.env.VITE_USE_MOCK_DATA ?? "true").toString().toLowerCase() !== "false";

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected error communicating with the server.";
    return Promise.reject(new Error(message));
  }
);
