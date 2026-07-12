import api from "./axios";
import type { User } from "../types";

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const signupApi = (data: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>("/auth/signup", data);

export const loginApi = (data: { email: string; password: string }) =>
  api.post<AuthResponse>("/auth/login", data);

export const logoutApi = () => api.post("/auth/logout");
