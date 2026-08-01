"use client";

import {
  Users,
  FolderKanban,
  FileText,
  MessageCircle,
  FileSignature,
  RefreshCcw,
} from "lucide-react";

import { useEffect, useState, useCallback } from "react";
import StatCard from "./StatCard";
import { adminDashboardApi, DashboardStats, RecentActivityItem, SystemStatusItem } from "@/src/lib/api/admin-dashboard";
import { ApiError } from "@/src/lib/api-client";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState<DashboardStats>({
    totalUsers: 0,
    projects: 0,
    researchPapers: 0,
    messages: 0,
    agreements: 0,
  });
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatusItem[]>([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminDashboardApi.stats();
      setData(res.stats);
      setActivities(res.recentActivity);
      setSystemStatus(res.systemStatus);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2">Welcome to UniSync Administration Panel</p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon={<Users size={28} />}
          color="bg-blue-100 text-blue-700"
        />

        <StatCard
          title="Projects"
          value={data.projects}
          icon={<FolderKanban size={28} />}
          color="bg-green-100 text-green-700"
        />

        <StatCard
          title="Research Papers"
          value={data.researchPapers}
          icon={<FileText size={28} />}
          color="bg-purple-100 text-purple-700"
        />

        <StatCard
          title="Messages"
          value={data.messages}
          icon={<MessageCircle size={28} />}
          color="bg-cyan-100 text-cyan-700"
        />

        <StatCard
          title="Agreements"
          value={data.agreements}
          icon={<FileSignature size={28} />}
          color="bg-indigo-100 text-indigo-700"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Activities */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">Recent Activities</h2>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-slate-400 text-sm">No recent activity.</p>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="border-b pb-3">
                  <p>{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">System Status</h2>

          <div className="space-y-5">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span
                  className={
                    item.ok === true
                      ? "text-green-600 font-semibold"
                      : item.ok === false
                      ? "text-red-600 font-semibold"
                      : "text-slate-400 font-semibold"
                  }
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}