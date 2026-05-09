import api from "./api";
import type { Order } from "@/types/order";

export const createOrder = async (items: { productId: string; quantity: number }[]): Promise<Order> => {
  const { data } = await api.post<Order>("/api/orders", { items });
  return data;
};

export const listMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>("/api/orders/my");
  return data;
};

export const listOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<Order[]>("/api/orders");
  return data;
};

export const updateOrderStatus = async (id: string, status: Order["status"]): Promise<Order> => {
  const { data } = await api.put<Order>(`/api/orders/${id}`, { status });
  return data;
};
