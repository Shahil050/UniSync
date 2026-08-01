import { api } from "../api-client";

export type ProjectStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export type AdminProject = {
  id: string;
  name: string;
  leader: string;
  leaderId: string;
  members: number;
  status: ProjectStatus;
  archived: boolean;
  createdAt: string;
};

export type AdminProjectsFilters = {
  search?: string;
  status?: ProjectStatus;
  archived?: "active" | "inactive";
  cursor?: string;
};

function buildQuery(filters: AdminProjectsFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.archived) params.set("archived", filters.archived);
  if (filters.cursor) params.set("cursor", filters.cursor);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const adminProjectsApi = {
  list: (filters: AdminProjectsFilters = {}) =>
    api.get<{ success: boolean; projects: AdminProject[] }>(`/api/admin/projects${buildQuery(filters)}`),

  setStatus: (id: string, status: ProjectStatus) =>
    api.patch<{ success: boolean; project: any }>(`/api/admin/projects/${id}/status`, { status }),

  deactivate: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/projects/${id}`),

  restore: (id: string) =>
    api.post<{ success: boolean; message: string }>(`/api/admin/projects/${id}/restore`),
};