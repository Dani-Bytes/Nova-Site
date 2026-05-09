import type { User } from "./auth";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
