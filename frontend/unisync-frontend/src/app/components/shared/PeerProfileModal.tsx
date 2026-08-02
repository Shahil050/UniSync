"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Github, Linkedin, ExternalLink, Award, CheckCircle2, MessageCircle, Sparkles, BookOpen } from "lucide-react";
import { usersApi } from "@/src/lib/api/users";
import { projectsApi } from "@/src/lib/api/projects";
import { ApiError } from "@/src/lib/api-client";
import { UserAvatar } from "./UserAvatar";

type ProfileData = {
  id: string;
  fullName: string;
  department: string | null;
  batch: string | null;
  bio: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  profileImage: string | null;
  institution: { name: string } | null;
  skills: { proficiency: number | null; skill: { id: string; name: string; type: "SKILL" | "INTEREST" } }[];
  badges: { projectId: string | null; awardedAt: string; badge: { name: string } }[];
};

type ProjectHistoryItem = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  members: { userId: string; user: { fullName: string } }[];
};

const formatUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

export function PeerProfileModal({
  userId,
  onClose,
  onMessage,
}: {
  userId: string;
  onClose: () => void;
  onMessage: (id: string) => void;
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [profileRes, projectsRes] = await Promise.all([
        usersApi.get(userId),
        projectsApi.list({ userId }),
      ]);
      setProfile(profileRes.user);
      setProjects(projectsRes.projects);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this profile.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const skills = profile?.skills.filter((s) => s.skill.type === "SKILL") ?? [];
  const interests = profile?.skills.filter((s) => s.skill.type === "INTEREST") ?? [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>

          {loading && (
            <div className="p-10 text-center text-slate-400 text-sm">Loading profile...</div>
          )}

          {!loading && error && (
            <div className="p-10 text-center text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && profile && (
            <>
              <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500" />

              <div className="px-6 pb-6 -mt-12">
                <UserAvatar
                  name={profile.fullName}
                  src={profile.profileImage}
                  size="xl"
                  className="border-4 border-white shadow-lg"
                />

                <div className="mt-4 mb-4">
                  <h2 className="font-black text-slate-800 text-xl">{profile.fullName}</h2>
                  <p className="text-blue-600 text-sm font-medium">
                    {profile.department ?? "—"} · {profile.institution?.name ?? "—"}
                  </p>
                  {profile.batch && <p className="text-slate-400 text-xs">Batch {profile.batch}</p>}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  {profile.bio || "No bio added yet."}
                </p>

                {(profile.githubUrl || profile.linkedinUrl) && (
                  <div className="flex gap-2 flex-wrap mb-5">
                    {profile.githubUrl && (
                      <a
                        href={formatUrl(profile.githubUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-700 font-medium transition-colors"
                      >
                        <Github size={15} /> GitHub <ExternalLink size={11} />
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={formatUrl(profile.linkedinUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 font-medium transition-colors"
                      >
                        <Linkedin size={15} /> LinkedIn <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                )}

                {skills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-700 text-sm mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s.skill.id} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {interests.length > 0 && (
                  <div className="mb-5">
                    <h3 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-blue-500" />
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {interests.map((s) => (
                        <span key={s.skill.id} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
                    <Award size={15} className="text-blue-500" />
                    Badges & Credentials
                  </h3>
                  {profile.badges.length === 0 ? (
                    <p className="text-slate-400 text-xs">No badges earned yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold bg-blue-500">
                          <CheckCircle2 size={12} />
                          {b.badge.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
                    <BookOpen size={15} className="text-blue-500" />
                    Project History
                  </h3>
                  {projects.length === 0 ? (
                    <p className="text-slate-400 text-xs">No projects yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {projects.map((p) => (
                        <div key={p.id} className="border border-blue-100 rounded-xl p-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-slate-800 text-sm">{p.title}</h4>
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                p.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onMessage(profile.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  <MessageCircle size={15} />
                  Message {profile.fullName.split(" ")[0]}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}