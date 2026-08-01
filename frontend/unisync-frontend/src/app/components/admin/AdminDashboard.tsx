"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { authApi } from "@/src/lib/api/auth";

import Dashboard from "./Dashboard";
import UsersPage from "./Users";
import Papers from "./Papers";
import Moderation from "./Moderation";
import Analytics from "./Analytics";
import SettingsPage from "./Settings";
import Projects from "./Projects";
import Groups from "./Groups";
import Agreements from "./Agreements";
import Messages from "./Messages";
import Reports from "./Reports";
import AdminProfile from "./AdminProfile";



type Tab =
  | "dashboard"
  | "users"
  | "projects"
  | "groups"
  | "agreements"
  | "messages"
  | "reports"
  | "papers"
  | "moderation"
  | "analytics"
  | "settings"
  | "profile";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    localStorage.removeItem("adminProfile");
    router.push("/admin/login");
  };
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
<div className="mt-8 border-t border-slate-700 pt-6">
  <button
    onClick={handleLogout}
    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
  >
    Logout
  </button>
</div>
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
{activeTab === "messages" && <Messages />}
{activeTab === "reports" && <Reports />}
{activeTab === "profile" && <AdminProfile />}



      </main>

    </div>
  );
}