import axios from "axios";

/**
 * 🚀 AXIOS INSTANCE
 * Simple, clean, and pre-configured for the entire app.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
   ========================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ✅ Automatically attach token if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =========================
   RESPONSE INTERCEPTOR
   ========================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // ✅ Handle Unauthorized or Token Expired
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Force redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
