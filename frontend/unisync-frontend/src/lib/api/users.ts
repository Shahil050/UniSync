import { api } from "../api-client";

export const usersApi = {
  get: (id: string) => api.get(`/api/users/${id}`),

  update: (
    id: string,
    data: {
      fullName?: string;
      department?: string;
      batch?: string;
      githubUrl?: string;
      linkedinUrl?: string;
      profileImage?: string;
      bio?: string;
    }
  ) => api.patch(`/api/users/${id}`, data),

  list: (params?: { search?: string; department?: string; skillCategory?: string; cursor?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.department) qs.set("department", params.department);
    if (params?.skillCategory) qs.set("skillCategory", params.skillCategory);
    if (params?.cursor) qs.set("cursor", params.cursor);
    const query = qs.toString();
    return api.get(`/api/users${query ? `?${query}` : ""}`);
  },

  discover: () => api.get("/api/users/discover"),

  listSkills: (search?: string) => api.get(`/api/skills${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  setSkills: (skills: { skillId: string; proficiency?: number }[]) =>
    api.post("/api/users/skills", { skills }),
};