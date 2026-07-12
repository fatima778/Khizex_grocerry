import api from "./axios";
import type { Order } from "../types";

export const checkoutApi = (data: { address: string; cardNumber: string }) =>
  api.post<Order>("/checkout", data);

export const getMyOrdersApi = () => api.get<Order[]>("/orders/my");
export const getAllOrdersApi = () => api.get<Order[]>("/orders");
export const updateOrderStatusApi = (id: string, status: string) =>
  api.put<Order>(`/orders/${id}/status`, { status });
