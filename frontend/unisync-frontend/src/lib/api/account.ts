import { api } from "../api-client";

export type AccountProfile = {
  id: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  profileImage: string | null;
  lastLoginAt: string | null;
  createdAt: string;
};

export const accountApi = {
  me: () => api.get<{ success: boolean; user: AccountProfile }>("/api/account/me"),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<{ success: boolean; message: string }>("/api/account/password", data),
};