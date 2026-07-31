"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Users, FileSignature, Award, AlertTriangle, MessageCircle, Star, X, Check, UserMinus } from "lucide-react";
import { notificationsApi } from "@/src/lib/api/notifications";
import { ApiError } from "@/src/lib/api-client";

type NotificationType =
  | "MEMBERSHIP_REQUEST"
  | "MEMBERSHIP_ACCEPTED"
  | "MEMBERSHIP_REJECTED"
  | "MEMBER_REMOVED"
  | "CONTRACT_SIGNED"
  | "CONTRACT_ACTIVATED"
  | "BADGE_AWARDED"
  | "PENALTY_ISSUED";

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const typeConfig: Record<NotificationType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  MEMBERSHIP_REQUEST: { label: "Join Request", icon: <Users size={15} />, color: "text-blue-600", bg: "bg-blue-100" },
  MEMBERSHIP_ACCEPTED: { label: "Request Accepted", icon: <Users size={15} />, color: "text-green-600", bg: "bg-green-100" },
  MEMBERSHIP_REJECTED: { label: "Request Declined", icon: <Users size={15} />, color: "text-slate-500", bg: "bg-slate-100" },
  MEMBER_REMOVED: { label: "Removed from Project", icon: <UserMinus size={15} />, color: "text-red-600", bg: "bg-red-100" },
  CONTRACT_SIGNED: { label: "Agreement Signed", icon: <FileSignature size={15} />, color: "text-blue-700", bg: "bg-blue-100" },
  CONTRACT_ACTIVATED: { label: "Agreement Active", icon: <FileSignature size={15} />, color: "text-green-700", bg: "bg-green-100" },
  BADGE_AWARDED: { label: "Badge Unlocked!", icon: <Award size={15} />, color: "text-amber-600", bg: "bg-amber-100" },
  PENALTY_ISSUED: { label: "Penalty Issued", icon: <AlertTriangle size={15} />, color: "text-red-600", bg: "bg-red-100" },
};

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const load = useCallback(async () => {
    try {
      const res = await notificationsApi.list();
      setNotifications(res.notifications);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch {
      // silent — next poll will reconcile if this failed
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationsApi.markAllRead();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not mark all as read.");
    }
  };

  const dismiss = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationsApi.dismiss(id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not dismiss notification.");
      load(); // resync if the delete actually failed server-side
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800 text-lg">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-blue-500 text-sm hover:underline">
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
      <div className="space-y-3">
        {loading && <p className="text-slate-400 text-sm">Loading...</p>}

        <AnimatePresence>
          {!loading && notifications.map((n) => {
            const config = typeConfig[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginTop: 0 }}
                onClick={() => !n.isRead && markRead(n.id)}
                className={`relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  !n.isRead ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-blue-100 hover:bg-slate-50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center ${config.color}`}>
                    {config.icon}
                  </div>
                  {!n.isRead && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{config.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-blue-400 text-xs mt-1">{timeAgo(n.createdAt)}</p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                  className="p-1 text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!loading && notifications.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
