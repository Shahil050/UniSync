import { api } from "../api-client";

export const authApi = {
  signup: (data: { fullName: string; email: string; password: string; department?: string }) =>
    api.post("/api/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/login", data),

  logout: () => api.post("/api/logout"),

  me: () => api.get("/api/me"),
};