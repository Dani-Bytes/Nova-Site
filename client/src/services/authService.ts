import api from "./api";
import type { AuthResponse, User } from "@/types/auth";

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
  return data;
};

export const login = async (payload: { email: string; password: string }): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
  return data;
};

export const getMe = async (): Promise<{ user: User }> => {
  const { data } = await api.get<{ user: User }>("/api/auth/me");
  return data;
};
