import { api } from "../api-client";

export const projectsApi = {
  list: (params?: { mine?: boolean; status?: string; userId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.mine) qs.set("mine", "true");
    if (params?.status) qs.set("status", params.status);
    if (params?.userId) qs.set("userId", params.userId);
    const query = qs.toString();
    return api.get(`/api/projects${query ? `?${query}` : ""}`);
  },

  get: (id: string) => api.get(`/api/projects/${id}`),

  create: (data: { title: string; description?: string }) =>
    api.post("/api/projects", data),

  update: (id: string, data: { title?: string; description?: string }) =>
    api.patch(`/api/projects/${id}`, data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/api/projects/${id}/status`, { status }),

  remove: (id: string) => api.delete(`/api/projects/${id}`),

  // Membership
  requestToJoin: (projectId: string) => api.post(`/api/projects/${projectId}/requests`),

  listRequests: (projectId: string) => api.get(`/api/projects/${projectId}/requests`),

  respondToRequest: (projectId: string, userId: string, decision: "ACCEPT" | "REJECT") =>
    api.patch(`/api/projects/${projectId}/requests/${userId}`, { decision }),

  leave: (projectId: string) => api.delete(`/api/projects/${projectId}/membership`),

  removeMember: (projectId: string, userId: string) =>
    api.delete(`/api/projects/${projectId}/members/${userId}`),

  // Contract
  getContract: (projectId: string) => api.get(`/api/projects/${projectId}/contract`),

  updateContractContent: (projectId: string, summary: string) =>
    api.patch(`/api/projects/${projectId}/contract`, { summary }),

  updateContractRole: (
    projectId: string,
    userId: string,
    data: { roleTitle?: string; responsibilities?: string; expectedHours?: number }
  ) => api.patch(`/api/projects/${projectId}/contract/roles/${userId}`, data),

  signContract: (projectId: string) => api.post(`/api/projects/${projectId}/contract/sign`),

  voidContract: (projectId: string) => api.post(`/api/projects/${projectId}/contract/void`),

  // Messages
  listMessages: (projectId: string, cursor?: string) =>
    api.get(`/api/projects/${projectId}/messages${cursor ? `?cursor=${cursor}` : ""}`),

  // Activity
  listActivity: (projectId: string, userId?: string) =>
    api.get(`/api/projects/${projectId}/activity${userId ? `?userId=${userId}` : ""}`),

  logActivity: (
    projectId: string,
    data: { activityType: string; description?: string; metadata?: unknown }
  ) => api.post(`/api/projects/${projectId}/activity`, data),

  // Badges & penalties
  awardBadge: (projectId: string, userId: string, badgeId: string) =>
    api.post(`/api/projects/${projectId}/members/${userId}/badges`, { badgeId }),

  issuePenalty: (
    projectId: string,
    userId: string,
    data: { reason: string; severity?: "MINOR" | "MAJOR" }
  ) => api.post(`/api/projects/${projectId}/members/${userId}/penalties`, data),

  // Papers
  getRecommendedPapers: (projectId: string) => api.get(`/api/projects/${projectId}/papers`),
};