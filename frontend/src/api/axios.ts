import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let queue: (() => void)[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          useAuthStore.getState().setAccessToken(res.data.accessToken);
          queue.forEach((cb) => cb());
          queue = [];
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        queue.push(() => resolve(api(originalRequest)));
      });
    }

    return Promise.reject(error);
  }
);

export default api;
