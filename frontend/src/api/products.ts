import api from "./axios";
import type { Product } from "../types";

export interface ProductsResponse {
  products: Product[];
  pagination: { total: number; page: number; pages: number };
}

export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export const getProductsApi = (query: ProductQuery = {}) =>
  api.get<ProductsResponse>("/products", { params: query });

export const getProductByIdApi = (id: string) => api.get<Product>(`/products/${id}`);

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  unit: "kg" | "lb" | "pack" | "each";
  category: string;
  subcategory?: string;
  stock: number;
  lowStockThreshold?: number;
  images?: string[];
}

export const createProductApi = (data: ProductInput) => api.post<Product>("/products", data);
export const updateProductApi = (id: string, data: Partial<ProductInput>) =>
  api.put<Product>(`/products/${id}`, data);
export const deleteProductApi = (id: string) => api.delete(`/products/${id}`);
