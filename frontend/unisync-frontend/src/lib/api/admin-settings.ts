import { api } from "../api-client";

export type SystemSettings = {
  sessionTimeoutMinutes: number;
  maxUploadSizeMB: number;
  updatedAt: string;
};

export const adminSettingsApi = {
  get: () => api.get<{ success: boolean; settings: SystemSettings }>("/api/admin/settings"),

  update: (data: { sessionTimeoutMinutes?: number; maxUploadSizeMB?: number }) =>
    api.patch<{ success: boolean; settings: SystemSettings }>("/api/admin/settings", data),
};