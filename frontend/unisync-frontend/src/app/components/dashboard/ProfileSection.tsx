"use client";
import { useState, useEffect, useCallback } from "react";
import { Github, Linkedin, Award, Edit3, Camera, ExternalLink, CheckCircle2 } from "lucide-react";
import type { AppUser } from "../../UserContext";
import { usersApi } from "@/src/lib/api/users";
import { projectsApi } from "@/src/lib/api/projects";
import { ApiError } from "@/src/lib/api-client";

type ProfileData = {
  bio: string | null;
  department: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  institution: { name: string } | null;
  badges: { projectId: string | null; awardedAt: string; badge: { name: string } }[];
};

type ProjectHistoryItem = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  members: { userId: string; user: { fullName: string } }[];
  hasBadge: boolean;
};

const formatUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

export function ProfileSection({ user }: { user: AppUser }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectHistoryItem[]>([]);
  const [editing, setEditing] = useState(false);

  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [profileRes, projectsRes] = await Promise.all([
        usersApi.get(user.id),
        projectsApi.list({ userId: user.id }),
      ]);

      const p = profileRes.user;
      setProfile(p);
      setBio(p.bio ?? "");
      setGithub(p.githubUrl ?? "");
      setLinkedin(p.linkedinUrl ?? "");

      const badgedProjectIds = new Set(
        (p.badges as ProfileData["badges"]).map((b) => b.projectId).filter(Boolean)
      );

      setProjects(
        projectsRes.projects.map((proj: any) => ({
          ...proj,
          hasBadge: badgedProjectIds.has(proj.id),
        }))
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load profile.");
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      await usersApi.update(user.id, {
        bio,
        githubUrl: github || undefined,
        linkedinUrl: linkedin || undefined,
      });
      setEditing(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!profile) return;
    setBio(profile.bio ?? "");
    setGithub(profile.githubUrl ?? "");
    setLinkedin(profile.linkedinUrl ?? "");
    setEditing(false);
  };

  if (!profile) {
    return <div className="p-6 text-slate-400 text-sm">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 relative">
          <button
            disabled
            title="Photo upload coming soon"
            className="absolute top-3 right-3 p-2 bg-white/20 rounded-xl text-white opacity-50 cursor-not-allowed"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg"
              />
              <button
                disabled
                title="Photo upload coming soon"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-300 rounded-full flex items-center justify-center text-white cursor-not-allowed border-2 border-white"
              >
                <Camera size={12} />
              </button>
            </div>

            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="mb-4">
            <h2 className="font-black text-slate-800 text-xl">{user.name}</h2>
            <p className="text-blue-600 text-sm font-medium">
              {profile.department ?? "—"} · {profile.institution?.name ?? "—"}
            </p>
            <p className="text-slate-400 text-xs">{user.email}</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Bio */}
          <div className="mb-4">
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            ) : (
              <p className="text-slate-600 text-sm leading-relaxed">{profile.bio || "No bio added yet."}</p>
            )}
          </div>

          {/* Social Links */}
          <div className="mb-5">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="GitHub Profile URL"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="LinkedIn Profile URL"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
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
          </div>

          {/* Badges */}
          <div>
            <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
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
        </div>
      </div>

      {/* Project History */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4">Project History</h3>
        {projects.length === 0 ? (
          <p className="text-slate-400 text-sm">No projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.id} className="border border-blue-100 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{p.title}</h4>
                    <p className="text-slate-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 text-xs">With:</span>
                  {p.members
                    .filter((m) => m.userId !== user.id)
                    .map((m) => (
                      <span key={m.userId} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                        {m.user.fullName}
                      </span>
                    ))}
                  {p.hasBadge && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <Award size={12} /> Badge Earned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}