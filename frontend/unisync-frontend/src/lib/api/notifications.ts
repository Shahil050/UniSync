import { api } from "../api-client";

export const notificationsApi = {
  list: (cursor?: string) => api.get(`/api/notifications${cursor ? `?cursor=${cursor}` : ""}`),
  markRead: (id: string) => api.patch(`/api/notifications/${id}/read`),
  markAllRead: () => api.patch(`/api/notifications/read-all`),
  dismiss: (id: string) => api.delete(`/api/notifications/${id}`),
};