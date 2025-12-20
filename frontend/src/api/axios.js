import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: on 401 remove token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem("token");
        // Guarantee we don't run into react-router history issues here:
        window.location.href = "/login";
      } catch (e) {
        console.error("Failed to handle 401:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
