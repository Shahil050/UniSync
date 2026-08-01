import { api } from "../api-client";

export type AdminMessage = {
  id: string;
  sender: string;
  receiver: string;
  type: "Direct" | "Project";
  content: string;
  createdAt: string;
  deleted: boolean;
};

export type AdminMessagesFilters = {
  search?: string;
  date?: string; // YYYY-MM-DD
  type?: "project" | "direct";
  includeDeleted?: boolean;
  cursor?: string;
};

function buildQuery(filters: AdminMessagesFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.date) params.set("date", filters.date);
  if (filters.type) params.set("type", filters.type);
  if (filters.includeDeleted) params.set("includeDeleted", "true");
  if (filters.cursor) params.set("cursor", filters.cursor);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const adminMessagesApi = {
  list: (filters: AdminMessagesFilters = {}) =>
    api.get<{ success: boolean; messages: AdminMessage[] }>(`/api/admin/messages${buildQuery(filters)}`),

  remove: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/messages/${id}`),
};