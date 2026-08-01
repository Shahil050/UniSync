import { api } from "../api-client";

export type DashboardStats = {
  totalUsers: number;
  projects: number;
  researchPapers: number;
  messages: number;
  agreements: number;
};

export type RecentActivityItem = {
  text: string;
  createdAt: string;
};

export type SystemStatusItem = {
  name: string;
  value: string;
  ok: boolean | null; // null = not implemented / unknown
};

export const adminDashboardApi = {
  stats: () =>
    api.get<{
      success: boolean;
      stats: DashboardStats;
      recentActivity: RecentActivityItem[];
      systemStatus: SystemStatusItem[];
    }>("/api/admin/dashboard/stats"),
};