import api from "./axios";
import type { User } from "../types";

export const listStaffApi = () => api.get<User[]>("/users/staff");
export const createStaffApi = (data: { name: string; email: string; password: string }) =>
  api.post<User>("/users/staff", data);
export const removeStaffApi = (id: string) => api.delete(`/users/staff/${id}`);
