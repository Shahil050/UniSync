"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  FileSignature,
  MessageCircle,
  BarChart2,
  Bell,
  Trophy,
  Zap,
  ChevronDown,
  LogOut,
  Upload,
} from "lucide-react";
import { ProfileSection } from "../components/dashboard/ProfileSection";
import { DiscoverPeers } from "../components/dashboard/DiscoverPeers";
import { IdeasFeed } from "../components/dashboard/IdeasFeed";
import { AgreementsModule } from "../components/dashboard/AgreementsModule";
import { MessagesModule } from "../components/dashboard/MessagesModule";
import { ActivityLogs } from "../components/dashboard/ActivityLogs";
import { DeadlineReminders } from "../components/dashboard/DeadlineReminders";
import { NotificationsPanel } from "../components/dashboard/NotificationsPanel";
import { PaperUploadPanel } from "../components/dashboard/PaperUploadPanel";
import { SearchBar } from "../components/shared/SearchBar";
import { UserAvatar } from "../components/shared/UserAvatar";
import { useUser } from "../UserContext";
import { usersApi } from "@/src/lib/api/users";
import { projectsApi } from "@/src/lib/api/projects";
import { notificationsApi } from "@/src/lib/api/notifications";
import { ApiError } from "@/src/lib/api-client";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}

type Tab = "overview" | "profile" | "discover" | "ideas" | "agreements" | "messages" | "activity" | "notifications" | "upload-papers";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "discover", label: "Discover", icon: <Users size={16} /> },
  { id: "ideas", label: "Ideas", icon: <Lightbulb size={16} /> },
  { id: "agreements", label: "Agreements", icon: <FileSignature size={16} /> },
  { id: "messages", label: "Messages", icon: <MessageCircle size={16} /> },
  { id: "activity", label: "Activity", icon: <BarChart2 size={16} /> },
  { id: "notifications", label: "Notification", icon: <Bell size={16} /> },
];

const ADMIN_TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "upload-papers", label: "Upload Papers", icon: <Upload size={16} /> },
];

export function DashboardPage() {
  const { user, onLogout } = useUser();
  const isAdmin = user.role === "ADMIN";
  const tabs = isAdmin ? ADMIN_TABS : TABS;
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "overview";
  const [activeTab, setActiveTab] = useState<Tab>(isAdmin ? "upload-papers" : initialTab);
  const [profileOpen, setProfileOpen] = useState(false);
  const [overviewStats, setOverviewStats] = useState({
    projects: 0,
    badges: 0,
    penalties: 0,
    pendingAgreements: 0,
    unreadNotifications: 0,
  });

  useEffect(() => {
    if (isAdmin) return;
    let cancelled = false;
    Promise.all([
      usersApi.get(user.id),
      projectsApi.list({ userId: user.id }),
      projectsApi.list({ mine: true }),
      notificationsApi.list(),
    ])
      .then(([profileRes, projectsRes, mineRes, notificationsRes]) => {
        if (cancelled) return;
        const pendingAgreements = mineRes.projects.filter(
          (p: any) => p.contract?.status === "DRAFT"
        ).length;
        setOverviewStats({
          projects: projectsRes.projects.length,
          badges: profileRes.user.badges.length,
          penalties: profileRes.user.penaltyTags?.length ?? 0,
          pendingAgreements,
          unreadNotifications: notificationsRes.unreadCount ?? 0,
        });
      })
      .catch((err) => {
        // Overview stats are supplementary — fail quietly and keep zeros rather than blocking the page.
        if (!(err instanceof ApiError)) console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, [isAdmin, user.id]);

  return (
    <div className="min-h-screen bg-blue-50/50 pt-16">
      {/* Top bar */}
      <div className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 py-3">

  <div className="flex items-center gap-4 flex-1">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg overflow-hidden">
        <Image
          src="/handshake-agreement-icon.avif"
          alt="UniSync logo"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>

      <span className="font-bold text-slate-700 text-sm hidden sm:block">
        Dashboard
      </span>
    </div>

    <SearchBar className="flex-1 max-w-md" />
  </div>

  {/* Profile */}
  <div className="relative">
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="flex items-center gap-2 rounded-xl p-1 hover:bg-blue-50 transition"
    >
      <UserAvatar name={user.name} src={user.avatar} size="md" />
      <ChevronDown size={16} className="text-slate-500" />
    </button>

        <AnimatePresence>
      {profileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-3 w-72 rounded-2xl bg-white shadow-2xl border border-blue-100 overflow-hidden z-50"
        >

          <div className="p-5 text-center border-b border-slate-100">
            <UserAvatar name={user.name} src={user.avatar} size="xl" className="mx-auto" />

            <h3 className="font-bold text-slate-800 mt-3">
              {user.name}
            </h3>

            <p className="text-sm text-slate-500">
              {user.email}
            </p>
          </div>


          <div className="p-4 space-y-2">

            {!isAdmin && (
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setProfileOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium transition"
              >
                View Profile
              </button>
            )}


            <button
              onClick={() => {
                onLogout();
                setProfileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 border border-red-200 text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={16}/>
              Logout
            </button>

          </div>

        </motion.div>
      )}
    </AnimatePresence>

  </div>

</div>

          {/* Tab navigation */}
          <div className="flex overflow-x-auto gap-1 pb-0 scrollbar-hide">
            {tabs.map((tab) => (
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
        {isAdmin && activeTab === "upload-papers" && <PaperUploadPanel />}

        {!isAdmin && activeTab === "overview" && (
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
                <p className="text-blue-200 text-sm mb-1">{greeting()}</p>
                <h1 className="text-2xl font-black mb-2">{user.name} </h1>
                <p className="text-blue-200 text-sm">
                  {overviewStats.pendingAgreements === 0 && overviewStats.unreadNotifications === 0
                    ? "You're all caught up — no pending agreements or new notifications."
                    : `You have ${overviewStats.pendingAgreements} pending agreement${overviewStats.pendingAgreements === 1 ? "" : "s"} and ${overviewStats.unreadNotifications} new notification${overviewStats.unreadNotifications === 1 ? "" : "s"}.`}
                </p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setActiveTab("discover")} className="px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
                    Find Peers
                  </button>
                  <button onClick={() => setActiveTab("ideas")} className="px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors">
                    Browse Ideas
                  </button>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {[
    { label: "Projects", value: String(overviewStats.projects), icon: <FileSignature size={18} />, color: "cyan" },
    { label: "Badges", value: String(overviewStats.badges), icon: <Zap size={18} />, color: "sky" },
    { label: "Penalties", value: String(overviewStats.penalties), icon: <Trophy size={18} />, color: "blue" },
  ].map((s) => (
    <div
      key={s.label}
      className="bg-white rounded-2xl border border-blue-100 p-4 text-center shadow-sm h-full"
    >
      <div className="text-blue-600 flex justify-center mb-2">{s.icon}</div>
      <div className="text-xl font-black text-slate-800">{s.value}</div>
      <div className="text-slate-400 text-xs">{s.label}</div>
    </div>
  ))}
</div>

    
             <DeadlineReminders />

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
         
        {!isAdmin && activeTab === "profile" && <ProfileSection user={user} />}
        {!isAdmin && activeTab === "discover" && <DiscoverPeers />}
        {!isAdmin && activeTab === "ideas" && <IdeasFeed />}
        {!isAdmin && activeTab === "agreements" && <AgreementsModule />}
        {!isAdmin && activeTab === "messages" && <MessagesModule user={user} />}
        {!isAdmin && activeTab === "activity" && <ActivityLogs />}
        {!isAdmin && activeTab === "notifications" && <NotificationsPanel />}

      </div>
    </div>
  );
}