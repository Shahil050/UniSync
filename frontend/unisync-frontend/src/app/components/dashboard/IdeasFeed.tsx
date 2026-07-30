"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { UserPlus, BookOpen, Clock, Plus, X } from "lucide-react";
import { projectsApi } from "@/src/lib/api/projects";
import { ApiError } from "@/src/lib/api-client";
import { useUser } from "../../UserContext";

type Member = { userId: string; role: string; status: string };
type Project = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  owner: { id: string; fullName: string; profileImage: string | null };
  members: Member[];
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

function requestState(project: Project, userId: string): "own" | "none" | "PENDING" | "ACTIVE" | "REJECTED" | "LEFT" | "REMOVED" {
  if (project.owner.id === userId) return "own";
  const membership = project.members.find((m) => m.userId === userId);
  return membership ? (membership.status as any) : "none";
}

function ProjectCard({ project, userId, onRequest }: { project: Project; userId: string; onRequest: (id: string) => void }) {
  const state = requestState(project, userId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden"
    >
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3 mb-4">
          {project.owner.profileImage ? (
            <img src={project.owner.profileImage} alt={project.owner.fullName} className="w-10 h-10 rounded-xl object-cover border-2 border-blue-100" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {project.owner.fullName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800 text-sm">{project.owner.fullName}</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-slate-400 text-xs">
            <Clock size={12} />
            {timeAgo(project.createdAt)}
          </div>
        </div>

        <div className="flex items-start gap-2 mb-2">
          <BookOpen size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <h3 className="font-bold text-slate-800 text-base leading-snug">{project.title}</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 pl-6">
          {project.description || "No description provided."}
        </p>
      </div>

      <div className="border-t border-blue-50 px-5 py-3 flex items-center">
        {state === "own" && (
          <span className="ml-auto px-4 py-1.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-500">
            Your project
          </span>
        )}
        {state === "none" && (
          <button
            onClick={() => onRequest(project.id)}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            <UserPlus size={14} />
            Request to Join
          </button>
        )}
        {state === "PENDING" && (
          <span className="ml-auto px-4 py-1.5 rounded-xl text-sm font-semibold bg-amber-100 text-amber-700">
            Requested ✓
          </span>
        )}
        {state === "ACTIVE" && (
          <span className="ml-auto px-4 py-1.5 rounded-xl text-sm font-semibold bg-green-100 text-green-700">
            You're a member
          </span>
        )}
        {state === "REJECTED" && (
          <button
            onClick={() => onRequest(project.id)}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            <UserPlus size={14} />
            Request Again
          </button>
        )}
        {(state === "LEFT" || state === "REMOVED") && (
          <span className="ml-auto px-4 py-1.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-500">
            No longer a member
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function IdeasFeed() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await projectsApi.list(); // default discovery view — OPEN projects only
      setProjects(res.projects);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load ideas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRequest = async (projectId: string) => {
    try {
      await projectsApi.requestToJoin(projectId);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send request.");
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    setError("");
    try {
      await projectsApi.create({ title: newTitle.trim(), description: newDescription.trim() || undefined });
      setNewTitle("");
      setNewDescription("");
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not post idea.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800 text-lg">Posted Ideas</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <BookOpen size={14} />
          Post an Idea
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      {loading && <p className="text-slate-400 text-sm">Loading ideas...</p>}
      {!loading && projects.length === 0 && <p className="text-slate-400 text-sm">No open projects yet. Be the first to post one!</p>}

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} userId={user.id} onRequest={handleRequest} />
      ))}

      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                Post a New Idea
              </h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 p-1 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI-Powered Crop Disease Detection"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  placeholder="What are you building, and what kind of collaborators are you looking for?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim() || creating}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "Posting..." : "Post Idea"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}