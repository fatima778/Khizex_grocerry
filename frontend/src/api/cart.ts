import api from "./axios";
import type { Cart } from "../types";

export const getCartApi = () => api.get<Cart>("/cart");
export const addToCartApi = (productId: string, quantity: number) =>
  api.post<Cart>("/cart/add", { productId, quantity });
export const updateCartItemApi = (productId: string, quantity: number) =>
  api.put<Cart>("/cart/update", { productId, quantity });
export const removeFromCartApi = (productId: string) =>
  api.delete<Cart>(`/cart/${productId}`);
