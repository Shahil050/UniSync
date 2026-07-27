"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Users, FileSignature, MessageCircle, Star, X, Check } from "lucide-react";

type Notification = {
  id: number;
  type: "request" | "agreement" | "message" | "match" | "badge";
  title: string;
  description: string;
  avatar: string;
  time: string;
  isRead: boolean;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "request",
    title: "Collaboration Request",
    description: "Priya Thapa wants to collaborate on your 'AI Chatbot' idea.",
    avatar: "/kajal.jpg",
    time: "5m ago",
    isRead: false,
  },
  {
    id: 2,
    type: "agreement",
    title: "Agreement Update",
    description: "Roshan Karki accepted the Campus Event Aggregator agreement.",
    avatar: "/shahil.jpg",
    time: "1h ago",
    isRead: false,
  },
  {
    id: 3,
    type: "match",
    title: "New Peer Match",
    description: "You matched with Anisha Basnet — 4 shared interests in Data Science!",
    avatar: "/kajalimage2.jpg",
    time: "3h ago",
    isRead: true,
  },
  {
    id: 4,
    type: "message",
    title: "New Message",
    description: "Bikash Gurung sent a message in AI Project Group.",
    avatar: "/user1image.jpg",
    time: "5h ago",
    isRead: true,
  },
  {
    id: 5,
    type: "badge",
    title: "Badge Unlocked!",
    description: "You earned the 'Team Player' badge for completing your first group project!",
    avatar: "",
    time: "1d ago",
    isRead: true,
  },
];

const typeConfig = {
  request: { icon: <Users size={15} />, color: "text-blue-600", bg: "bg-blue-100" },
  agreement: { icon: <FileSignature size={15} />, color: "text-blue-700", bg: "bg-blue-100" },
  message: { icon: <MessageCircle size={15} />, color: "text-cyan-600", bg: "bg-cyan-100" },
  match: { icon: <Star size={15} />, color: "text-blue-500", bg: "bg-blue-50" },
  badge: { icon: <Bell size={15} />, color: "text-amber-600", bg: "bg-amber-100" },
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
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
        <button
          onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
          className="flex items-center gap-1.5 text-blue-500 text-sm hover:underline"
        >
          <Check size={14} />
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((n) => {
            const config = typeConfig[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginTop: 0 }}
                onClick={() => markRead(n.id)}
                className={`relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  !n.isRead ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-blue-100 hover:bg-slate-50"
                }`}
              >
                {/* Avatar / type icon */}
                <div className="relative flex-shrink-0">
                  {n.avatar ? (
                    <img src={n.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-blue-100" />
                  ) : (
                    <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center ${config.color}`}>
                      {config.icon}
                    </div>
                  )}
                  {!n.isRead && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{n.description}</p>
                  <p className="text-blue-400 text-xs mt-1">{n.time}</p>
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

        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
