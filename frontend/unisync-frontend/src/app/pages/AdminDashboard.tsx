"use client";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldAlert,
  BarChart3,
  Settings,
  FolderKanban,
  UsersRound,
  FileSignature,
  Sparkles,
  MessageSquare,
  Flag,
  Bell,
  UserCog,
} from "lucide-react";



import Dashboard from "../components/admin/Dashboard";
import UsersPage from "../components/admin/Users";
import Papers from "../components/admin/Papers";
import Moderation from "../components/admin/Moderation";
import Analytics from "../components/admin/Analytics";
import SettingsPage from "../components/admin/Settings";
import Projects from "../components/admin/Projects";
import Groups from "../components/admin/Groups";
import Agreements from "../components/admin/Agreements";
import Recommendations from "../components/admin/Recommendations";
import Messages from "../components/admin/Messages";
import Reports from "../components/admin/Reports";
import Notifications from "../components/admin/Notifications";
import AdminProfile from "../components/admin/AdminProfile";



type Tab =
  | "dashboard"
  | "users"
  | "projects"
  | "groups"
  | "agreements"
  | "recommendations"
  | "messages"
  | "reports"
  | "notifications"
  | "papers"
  | "moderation"
  | "analytics"
  | "settings"
  | "profile";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">

        <div className="flex items-center gap-3 mb-10">

  <Image
    src="/logo.avif"
    alt="UniSync Logo"
    width={50}
    height={50}
    className="rounded-xl"
  />

  <div>
    <h1 className="text-2xl font-bold text-white">
      UniSync
    </h1>

    <p className="text-sm text-blue-400">
      Admin Panel
    </p>
  </div>

</div>

        <div className="space-y-2">

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "dashboard"
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "users"
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <Users size={18} />
            Users
          </button>

          <button
            onClick={() => setActiveTab("papers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "papers"
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <FileText size={18} />
            Research Papers
          </button>
          <button
  onClick={() => setActiveTab("projects")}
  className={`w-full text-left px-4 py-3 rounded-xl ${
    activeTab === "projects"
      ? "bg-blue-600 text-white"
      : "hover:bg-slate-800"
  }`}
>
 📁 Projects
</button>


<button
  onClick={() => setActiveTab("groups")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
    activeTab === "groups"
      ? "bg-blue-600"
      : "hover:bg-slate-800"
  }`}
>
  <UsersRound size={18} />
  Research Groups
</button>
<button
  onClick={() => setActiveTab("agreements")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
    activeTab === "agreements"
      ? "bg-blue-600"
      : "hover:bg-slate-800"
  }`}
>
  <FileSignature size={18} />
  Agreements
</button>

<button
  onClick={() => setActiveTab("recommendations")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
    activeTab === "recommendations"
      ? "bg-blue-600"
      : "hover:bg-slate-800"
  }`}
>
  <Sparkles size={18} />
  Recommendations
</button>

<button
  onClick={() => setActiveTab("messages")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
    activeTab === "messages"
      ? "bg-blue-600"
      : "hover:bg-slate-800"
  }`}
>
  <MessageSquare size={18} />
  Messages
</button>

<button
  onClick={() => setActiveTab("reports")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
    activeTab === "reports"
      ? "bg-blue-600"
      : "hover:bg-slate-800"
  }`}
>
  <Flag size={18} />
  Reports
</button>

<button
  onClick={() => setActiveTab("notifications")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
    activeTab === "notifications"
      ? "bg-blue-600"
      : "hover:bg-slate-800"
  }`}
>
  <Bell size={18} />
  Notifications
</button>







          <button
            onClick={() => setActiveTab("moderation")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "moderation"
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <ShieldAlert size={18} />
            Moderation
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "analytics"
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "settings"
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <Settings size={18} />
            Settings
          </button>

        <button
  onClick={() => setActiveTab("profile")}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
    activeTab === "profile"
      ? "bg-blue-600"
      : "hover:bg-slate-800"
  }`}
>
  <UserCog size={18}/>
  Admin Profile
</button>


        </div>
      </aside>

      {/* Main Content */}

      <main className="flex-1 p-8">

        {activeTab === "dashboard" && <Dashboard />}

{activeTab === "users" && <UsersPage />}

{activeTab === "projects" && <Projects />}

{activeTab === "papers" && <Papers />}

{activeTab === "moderation" && <Moderation />}

{activeTab === "analytics" && <Analytics />}

{activeTab === "settings" && <SettingsPage />}
{activeTab === "groups" && <Groups />}
{activeTab === "agreements" && <Agreements />}
{activeTab === "recommendations" && <Recommendations />}
{activeTab === "messages" && <Messages />}
{activeTab === "reports" && <Reports />}
{activeTab === "notifications" && <Notifications />}
{activeTab === "profile" && <AdminProfile />}



      </main>

    </div>
  );
}