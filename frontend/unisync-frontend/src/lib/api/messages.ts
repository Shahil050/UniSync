import { api } from "../api-client";

export const messagesApi = {
  send: (data: { projectId?: string; recipientId?: string; content: string }) =>
    api.post("/api/messages", data),

  dmThread: (userId: string, cursor?: string) =>
    api.get(`/api/messages/thread/${userId}${cursor ? `?cursor=${cursor}` : ""}`),

  remove: (id: string) => api.delete(`/api/messages/${id}`),
};