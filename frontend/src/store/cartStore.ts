import { create } from "zustand";
import type { Cart } from "../types";
import { getCartApi, addToCartApi, updateCartItemApi, removeFromCartApi } from "../api/cart";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  lastAddedId: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearLocal: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  lastAddedId: null,
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await getCartApi();
      set({ cart: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addItem: async (productId, quantity) => {
    const res = await addToCartApi(productId, quantity);
    set({ cart: res.data, lastAddedId: productId });
  },
  updateItem: async (productId, quantity) => {
    const res = await updateCartItemApi(productId, quantity);
    set({ cart: res.data });
  },
  removeItem: async (productId) => {
    const res = await removeFromCartApi(productId);
    set({ cart: res.data });
  },
  clearLocal: () => set({ cart: null }),
}));
