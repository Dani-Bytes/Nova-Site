import api from "./api";
import type { Product } from "@/types/product";

export const listProducts = async (params?: {
  search?: string;
  category?: string;
}): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/api/products", { params });
  return data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/api/products/${id}`);
  return data;
};

export const createProduct = async (payload: Omit<Product, "_id">): Promise<Product> => {
  const { data } = await api.post<Product>("/api/products", payload);
  return data;
};

export const updateProduct = async (id: string, payload: Partial<Omit<Product, "_id">>): Promise<Product> => {
  const { data } = await api.put<Product>(`/api/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/api/products/${id}`);
  return data;
};
