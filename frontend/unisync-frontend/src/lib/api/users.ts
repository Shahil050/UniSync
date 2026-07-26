import { api } from "../api-client";

export const usersApi = {
  get: (id: string) => api.get(`/api/users/${id}`),

  update: (
    id: string,
    data: { fullName?: string; department?: string; batch?: string; githubUrl?: string; linkedinUrl?: string; profileImage?: string; bio?: string }
  ) => api.patch(`/api/users/${id}`, data),

  listSkills: () => api.get("/api/skills"),

  setSkills: (skills: { skillId: string; proficiency?: number }[]) =>
    api.post("/api/users/skills", { skills }),
};