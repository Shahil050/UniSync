"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { CalendarClock, AlertCircle } from "lucide-react";
import { projectsApi } from "@/src/lib/api/projects";
import { ApiError } from "@/src/lib/api-client";

type Deadline = {
  id: string;
  projectName: string;
  dueDate: string;
  daysLeft: number;
};

function daysUntil(dueDate: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / msPerDay);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function urgencyStyle(daysLeft: number) {
  if (daysLeft <= 2) {
    return { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", bar: "bg-red-500" };
  }
  if (daysLeft <= 7) {
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", bar: "bg-amber-500" };
  }
  return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", bar: "bg-blue-500" };
}

export function DeadlineReminders() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await projectsApi.list({ mine: true });
      const upcoming: Deadline[] = res.projects
        .filter((p: any) => p.status === "IN_PROGRESS" && p.contract?.dueDate)
        .map((p: any) => ({
          id: p.id,
          projectName: p.title,
          dueDate: p.contract.dueDate,
          daysLeft: daysUntil(p.contract.dueDate),
        }))
        .filter((d: Deadline) => d.daysLeft >= 0)
        .sort((a: Deadline, b: Deadline) => a.daysLeft - b.daysLeft)
        .slice(0, 3);
      setDeadlines(upcoming);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load deadlines.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock size={18} className="text-blue-600" />
        <h2 className="font-bold text-slate-800 text-base">Upcoming Deadlines</h2>
      </div>

      {loading && <p className="text-slate-400 text-sm text-center py-6">Loading deadlines...</p>}

      {!loading && error && (
        <p className="text-red-500 text-sm text-center py-6">{error}</p>
      )}

      {!loading && !error && deadlines.length === 0 && (
        <p className="text-slate-400 text-sm text-center py-6">No upcoming deadlines 🎉</p>
      )}

      {!loading && !error && deadlines.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {deadlines.map((d, i) => {
            const s = urgencyStyle(d.daysLeft);
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-xl border ${s.border} ${s.bg} p-3 relative overflow-hidden`}
              >
                {d.daysLeft <= 2 && (
                  <AlertCircle size={14} className={`absolute top-2 right-2 ${s.text}`} />
                )}
                <p className="font-semibold text-slate-800 text-xs truncate pr-4">{d.projectName}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{formatDate(d.dueDate)}</p>
                <p className={`font-bold text-sm mt-2 ${s.text}`}>
                  {d.daysLeft === 0 ? "Due today" : `${d.daysLeft} day${d.daysLeft === 1 ? "" : "s"} left`}
                </p>
                <div className="h-1 w-full bg-white/60 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${s.bar} rounded-full`}
                    style={{ width: `${Math.max(10, 100 - d.daysLeft * 5)}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}