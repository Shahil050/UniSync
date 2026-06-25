"use client";
import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Github, Linkedin, Star, Award, Edit3, Camera, ExternalLink, CheckCircle2, Download } from "lucide-react";
import type { AppUser } from "../../App";

const BADGES = [
  { label: "AI Explorer", color: "bg-blue-500", earned: true },
  { label: "Team Player", color: "bg-cyan-500", earned: true },
  { label: "Code Champion", color: "bg-sky-600", earned: true },
  { label: "Idea Starter", color: "bg-blue-700", earned: false },
];

const PROJECTS = [
  {
    name: "AI Crop Disease Detector",
    status: "Completed",
    start: "Jan 2025",
    end: "Apr 2025",
    peers: ["Priya T.", "Bikash G."],
    badge: true,
  },
  {
    name: "Real-Time Chat System",
    status: "Active",
    start: "May 2025",
    end: "—",
    peers: ["Roshan K."],
    badge: false,
  },
];

export function ProfileSection({ user }: { user: AppUser }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("Computer Engineering student passionate about AI and distributed systems. Currently exploring machine learning applications in agriculture.");

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden"
      >
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 relative">
          <button className="absolute top-3 right-3 p-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors">
            <Camera size={16} />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <Image
  src="/shahil.jpg"
  alt={user.name}
  width={80}
  height={80}
  className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
/>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors border-2 border-white">
                <Camera size={12} />
              </button>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <Edit3 size={14} />
              {editing ? "Save" : "Edit Profile"}
            </button>
          </div>

          <div className="mb-4">
            <h2 className="font-black text-slate-800 text-xl">{user.name}</h2>
            <p className="text-blue-600 text-sm font-medium">Computer Engineering · Pokhara University</p>
            <p className="text-slate-400 text-xs">{user.email}</p>
          </div>

          {/* Reputation */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
              <Star size={15} className="text-amber-500" fill="#f59e0b" />
              <span className="font-bold text-amber-700 text-sm">4.8</span>
              <span className="text-amber-500 text-xs">reputation</span>
            </div>
            <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "82%" }} />
            </div>
            <span className="text-xs text-slate-400">Level 5</span>
          </div>

          {/* Bio */}
          <div className="mb-4">
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            ) : (
              <p className="text-slate-600 text-sm leading-relaxed">{bio}</p>
            )}
          </div>

          {/* Social Links */}
          <div className="flex gap-2 mb-5">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-700 font-medium transition-colors">
              <Github size={15} />
              GitHub
              <ExternalLink size={11} className="text-slate-400" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 font-medium transition-colors">
              <Linkedin size={15} />
              LinkedIn
              <ExternalLink size={11} className="text-blue-400" />
            </a>
          </div>

          {/* Badges */}
          <div>
            <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <Award size={15} className="text-blue-500" />
              Badges & Credentials
            </h3>
            <div className="flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold ${b.earned ? b.color : "bg-slate-200 text-slate-400"}`}
                >
                  {b.earned && <CheckCircle2 size={12} />}
                  {b.label}
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1.5 text-blue-600 text-xs font-medium hover:underline">
              <Download size={13} />
              Export Credentials
            </button>
          </div>
        </div>
      </motion.div>

      {/* Project history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6"
      >
        <h3 className="font-bold text-slate-800 mb-4">Project History</h3>
        <div className="space-y-4">
          {PROJECTS.map((p) => (
            <div key={p.name} className="border border-blue-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{p.name}</h4>
                  <p className="text-slate-400 text-xs">{p.start} → {p.end}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  p.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">With:</span>
                {p.peers.map((peer) => (
                  <span key={peer} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">{peer}</span>
                ))}
                {p.badge && (
                  <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Award size={12} /> Badge Earned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
