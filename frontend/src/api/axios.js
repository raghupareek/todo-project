import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthRoute =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
