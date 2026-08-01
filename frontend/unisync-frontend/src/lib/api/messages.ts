import { api } from "../api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const messagesApi = {
  send: (data: { projectId?: string; recipientId?: string; content: string; file?: File | null }) => {
    if (data.file) {
      const form = new FormData();
      if (data.projectId) form.append("projectId", data.projectId);
      if (data.recipientId) form.append("recipientId", data.recipientId);
      form.append("content", data.content);
      form.append("file", data.file);
      return api.postForm("/api/messages", form);
    }
    return api.post("/api/messages", { projectId: data.projectId, recipientId: data.recipientId, content: data.content });
  },

  dmThread: (userId: string, cursor?: string) =>
    api.get(`/api/messages/thread/${userId}${cursor ? `?cursor=${cursor}` : ""}`),

  listConversations: () => api.get("/api/messages/conversations"),

  remove: (id: string) => api.delete(`/api/messages/${id}`),

  fileUrl: (messageId: string) => `${API_URL}/api/messages/${messageId}/file`,
};