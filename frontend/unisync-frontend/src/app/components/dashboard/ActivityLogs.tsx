"use client";

import { motion } from "motion/react";
import { Award, MessageCircle, FileSignature, Star, AlertTriangle, CheckCircle2 } from "lucide-react";

type ActivityItem = {
  id: number;
  type: "badge" | "message" | "agreement" | "rating" | "warning" | "completion";
  title: string;
  description: string;
  time: string;
};

const ACTIVITIES: ActivityItem[] = [
  { id: 1, type: "badge", title: "Badge Earned!", description: "You earned the 'AI Explorer' badge for completing the crop detection project.", time: "2 hours ago" },
  { id: 2, type: "completion", title: "Project Completed", description: "AI Crop Disease Detector marked as Completed with verified credentials.", time: "2 hours ago" },
  { id: 3, type: "rating", title: "Peer Feedback Received", description: "Priya Thapa gave you 5 stars: 'Excellent team player and strong coder!'", time: "3 hours ago" },
  { id: 4, type: "agreement", title: "Agreement Accepted", description: "You accepted the collaboration agreement for Campus Event Aggregator.", time: "1 day ago" },
  { id: 5, type: "message", title: "New Group Created", description: "A project group was auto-created for the Campus Event Aggregator agreement.", time: "1 day ago" },
  { id: 6, type: "warning", title: "Deadline Reminder", description: "Campus Event Aggregator deadline in 20 days. Stay on track!", time: "2 days ago" },
];

const typeConfig = {
  badge: { icon: <Award size={16} />, bg: "bg-amber-100", color: "text-amber-600", border: "border-amber-200" },
  message: { icon: <MessageCircle size={16} />, bg: "bg-blue-100", color: "text-blue-600", border: "border-blue-200" },
  agreement: { icon: <FileSignature size={16} />, bg: "bg-blue-100", color: "text-blue-700", border: "border-blue-200" },
  rating: { icon: <Star size={16} />, bg: "bg-blue-50", color: "text-blue-500", border: "border-blue-100" },
  warning: { icon: <AlertTriangle size={16} />, bg: "bg-amber-50", color: "text-amber-500", border: "border-amber-100" },
  completion: { icon: <CheckCircle2 size={16} />, bg: "bg-green-100", color: "text-green-600", border: "border-green-200" },
};

export function ActivityLogs() {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-slate-800 text-lg">Activity Timeline</h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-blue-100" />

        <div className="space-y-4">
          {ACTIVITIES.map((activity, i) => {
            const config = typeConfig[activity.type];
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 relative"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0 border ${config.border} z-10 bg-white`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-800 text-sm">{activity.title}</h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">{activity.time}</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{activity.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
