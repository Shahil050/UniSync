"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard, User, Users, Lightbulb, FileSignature,
  MessageCircle, BarChart2, Bell, Search, Trophy, Zap
} from "lucide-react";
import { ProfileSection } from "../components/dashboard/ProfileSection";
import { DiscoverPeers } from "../components/dashboard/DiscoverPeers";
import { IdeasFeed } from "../components/dashboard/IdeasFeed";
import { AgreementsModule } from "../components/dashboard/AgreementsModule";
import { MessagesModule } from "../components/dashboard/MessagesModule";
import { ActivityLogs } from "../components/dashboard/ActivityLogs";
import { NotificationsPanel } from "../components/dashboard/NotificationsPanel";
import { SearchBar } from "../components/shared/SearchBar";
import { useUser } from "../UserContext";

type Tab = "overview" | "profile" | "discover" | "ideas" | "agreements" | "messages" | "activity" | "notifications";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "discover", label: "Discover", icon: <Users size={16} /> },
  { id: "ideas", label: "Ideas", icon: <Lightbulb size={16} /> },
  { id: "agreements", label: "Agreements", icon: <FileSignature size={16} /> },
  { id: "messages", label: "Messages", icon: <MessageCircle size={16} /> },
  { id: "activity", label: "Activity", icon: <BarChart2 size={16} /> },
  { id: "notifications", label: "Alerts", icon: <Bell size={16} /> },
];

const LEADERBOARD = [
  { rank: 1, name: "Priya Thapa", score: 2340, avatar: "https://i.pravatar.cc/32?img=5" },
  { rank: 2, name: "Bikash Gurung", score: 2210, avatar: "https://i.pravatar.cc/32?img=11" },
  { rank: 3, name: "You", score: 1980, avatar: "https://i.pravatar.cc/32?img=3", isMe: true },
  { rank: 4, name: "Roshan Karki", score: 1820, avatar: "https://i.pravatar.cc/32?img=8" },
];

export function DashboardPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-blue-50/50 pt-16">
      {/* Top bar */}
      <div className="bg-white border-b border-blue-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-slate-700 text-sm hidden sm:block">Dashboard</span>
            </div>
            <SearchBar className="flex-1 max-w-md" />
            <div className="flex items-center gap-2 ml-auto">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover border-2 border-blue-200" />
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex overflow-x-auto gap-1 pb-0 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-6 text-white relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10">
                  <Zap size={120} className="text-white ml-4 mt-4" />
                </div>
                <p className="text-blue-200 text-sm mb-1">Good morning,</p>
                <h1 className="text-2xl font-black mb-2">{user.name} 👋</h1>
                <p className="text-blue-200 text-sm">You have 2 pending agreements and 3 new notifications today.</p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setActiveTab("discover")} className="px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
                    Find Peers
                  </button>
                  <button onClick={() => setActiveTab("ideas")} className="px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors">
                    Browse Ideas
                  </button>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Connections", value: "12", icon: <Users size={18} />, color: "blue" },
                  { label: "Projects", value: "4", icon: <FileSignature size={18} />, color: "cyan" },
                  { label: "Reputation", value: "4.8★", icon: <Trophy size={18} />, color: "blue" },
                  { label: "Badges", value: "3", icon: <Zap size={18} />, color: "sky" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-blue-100 p-4 text-center shadow-sm">
                    <div className="text-blue-600 flex justify-center mb-2">{s.icon}</div>
                    <div className="text-xl font-black text-slate-800">{s.value}</div>
                    <div className="text-slate-400 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Ideas */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Recent Ideas</h3>
                  <button onClick={() => setActiveTab("ideas")} className="text-blue-500 text-sm hover:underline">View all →</button>
                </div>
                <IdeasFeed />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Leaderboard */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={16} className="text-amber-500" />
                  <h3 className="font-bold text-slate-800">Leaderboard</h3>
                </div>
                <div className="space-y-3">
                  {LEADERBOARD.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-3 p-2 rounded-xl ${entry.isMe ? "bg-blue-50 border border-blue-200" : ""}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        entry.rank === 1 ? "bg-amber-400 text-white" :
                        entry.rank === 2 ? "bg-slate-300 text-slate-700" :
                        entry.rank === 3 ? "bg-orange-300 text-white" :
                        "bg-blue-100 text-blue-600"
                      }`}>
                        {entry.rank}
                      </span>
                      <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className={`flex-1 text-sm ${entry.isMe ? "font-bold text-blue-700" : "text-slate-700"}`}>
                        {entry.name}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{entry.score.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick notifications */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800">Recent Alerts</h3>
                  <button onClick={() => setActiveTab("notifications")} className="text-blue-500 text-sm hover:underline">View all →</button>
                </div>
                <NotificationsPanel />
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && <ProfileSection user={user} />}
        {activeTab === "discover" && <DiscoverPeers />}
        {activeTab === "ideas" && <IdeasFeed />}
        {activeTab === "agreements" && <AgreementsModule />}
        {activeTab === "messages" && <MessagesModule user={user} />}
        {activeTab === "activity" && <ActivityLogs />}
        {activeTab === "notifications" && <NotificationsPanel />}
      </div>
    </div>
  );
}