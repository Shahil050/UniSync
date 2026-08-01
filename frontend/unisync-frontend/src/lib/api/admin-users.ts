import { api } from "../api-client";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  department: string | null;
  role: "STUDENT" | "ADMIN";
  status: "Active" | "Inactive";
  emailVerified?: boolean;
  createdAt?: string;
};

export type AdminUsersFilters = {
  search?: string;
  department?: string;
  role?: "STUDENT" | "ADMIN";
  status?: "active" | "inactive";
  cursor?: string;
};

function buildQuery(filters: AdminUsersFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.department) params.set("department", filters.department);
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  if (filters.cursor) params.set("cursor", filters.cursor);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const adminUsersApi = {
  list: (filters: AdminUsersFilters = {}) =>
    api.get<{ success: boolean; users: AdminUser[] }>(`/api/admin/users${buildQuery(filters)}`),

 departments: () =>
    api.get<{ success: boolean; departments: string[] }>("/api/admin/users/departments"),

  create: (data: { fullName: string; email: string; password: string; department?: string; role?: "STUDENT" | "ADMIN" }) =>
    api.post<{ success: boolean; user: AdminUser }>("/api/admin/users", data),

  update: (id: string, data: { fullName?: string; department?: string; role?: "STUDENT" | "ADMIN" }) =>
    api.patch<{ success: boolean; user: AdminUser }>(`/api/admin/users/${id}`, data),

  deactivate: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/users/${id}`),

  restore: (id: string) =>
    api.post<{ success: boolean; message: string }>(`/api/admin/users/${id}/restore`),
};