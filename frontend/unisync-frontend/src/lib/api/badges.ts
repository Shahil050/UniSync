import { api } from "../api-client";

export const badgesApi = {
  list: () => api.get("/api/badges"),
};
