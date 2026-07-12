import api from "./axios";
import type { Complaint } from "../types";

export const createComplaintApi = (data: { subject: string; message: string }) =>
  api.post<Complaint>("/complaints", data);

export const getMyComplaintsApi = () => api.get<Complaint[]>("/complaints/my");
export const getAllComplaintsApi = () => api.get<Complaint[]>("/complaints");
export const replyToComplaintApi = (id: string, text: string) =>
  api.post<Complaint>(`/complaints/${id}/reply`, { text });
export const resolveComplaintApi = (id: string) => api.put<Complaint>(`/complaints/${id}/resolve`);
