"use client";

import { motion } from "motion/react";
import { CalendarClock, AlertCircle } from "lucide-react";

type Deadline = {
  id: number;
  projectName: string;
  dueDate: string;
  daysLeft: number;
};

const DEADLINES: Deadline[] = [
  { id: 1, projectName: "Real-Time Chat System", dueDate: "Aug 15, 2026", daysLeft: 16 },
  { id: 2, projectName: "Campus Event Aggregator", dueDate: "Aug 3, 2026", daysLeft: 4 },
  { id: 3, projectName: "AI Crop Disease Detector", dueDate: "Jul 31, 2026", daysLeft: 1 },
];

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
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock size={18} className="text-blue-600" />
        <h2 className="font-bold text-slate-800 text-base">Upcoming Deadlines</h2>
      </div>

      {DEADLINES.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-6">No upcoming deadlines 🎉</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEADLINES.map((d, i) => {
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
                <p className="text-slate-400 text-[11px] mt-0.5">{d.dueDate}</p>
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