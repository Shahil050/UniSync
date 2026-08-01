import { api } from "@/src/lib/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AdminPaper = {
  id: string;
  title: string;
  authors: string | null;
  url: string | null;
  addedBy: string;
  createdAt: string;
};

export const papersApi = {
  create: (data: { title: string; authors?: string; url?: string; pdf: File }) => {
    const form = new FormData();
    form.append("title", data.title);
    if (data.authors) form.append("authors", data.authors);
    if (data.url) form.append("url", data.url);
    form.append("pdf", data.pdf);
    return api.postForm(`/api/papers`, form);
  },

  // Recommended papers for a given project, derived from its title + description.
  recommendForProject: (projectId: string) => api.get(`/api/projects/${projectId}/papers`),

  fileUrl: (paperId: string) => `${API_URL}/api/papers/${paperId}/file`,

  // Admin management — list, edit metadata, permanently delete.
  adminList: (search?: string) =>
    api.get<{ success: boolean; papers: AdminPaper[] }>(
      `/api/admin/papers${search ? `?search=${encodeURIComponent(search)}` : ""}`
    ),

  adminUpdate: (id: string, data: { title?: string; authors?: string; url?: string }) =>
    api.patch<{ success: boolean; paper: AdminPaper }>(`/api/admin/papers/${id}`, data),

  adminDelete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/papers/${id}`),
};