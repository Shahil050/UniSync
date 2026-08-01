"use client";

import { FolderKanban } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { adminProjectsApi, AdminProject, ProjectStatus } from "@/src/lib/api/admin-projects";
import { ApiError } from "@/src/lib/api-client";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "Ongoing",
  COMPLETED: "Completed",
  ABANDONED: "Abandoned",
};

export default function Projects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [archived, setArchived] = useState<"active" | "inactive" | "">("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminProjectsApi.list({
        search: search || undefined,
        status: status || undefined,
        archived: archived || undefined,
      });
      setProjects(res.projects);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [search, status, archived]);

  useEffect(() => {
    const timeout = setTimeout(loadProjects, 300);
    return () => clearTimeout(timeout);
  }, [loadProjects]);

  const handleStatusChange = async (project: AdminProject, newStatus: ProjectStatus) => {
    try {
      await adminProjectsApi.setStatus(project.id, newStatus);
      await loadProjects();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  const handleToggleArchive = async (project: AdminProject) => {
    const confirmMsg = project.archived
      ? `Reactivate "${project.name}"?`
      : `Deactivate "${project.name}"?`;
    if (!confirm(confirmMsg)) return;

    try {
      if (project.archived) {
        await adminProjectsApi.restore(project.id);
      } else {
        await adminProjectsApi.deactivate(project.id);
      }
      await loadProjects();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Project Management</h2>
          <p className="text-slate-500 mt-1">Manage all research and collaboration projects.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Search Project..."
            className="border rounded-lg px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus | "")}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="ABANDONED">Abandoned</option>
          </select>

          <select
            className="border rounded-lg px-4 py-2"
            value={archived}
            onChange={(e) => setArchived(e.target.value as "active" | "inactive" | "")}
          >
            <option value="">Active Projects</option>
            <option value="active">Active</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Project</th>
              <th>Leader</th>
              <th>Members</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-5 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-5 text-center">
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((item) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FolderKanban className="text-blue-600" size={22} />
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          Project ID: {item.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>{item.leader}</td>
                  <td>{item.members}</td>

                  <td>
                    {/* <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value as ProjectStatus)}
                      disabled={item.archived}
                      className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border-0 disabled:opacity-50"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ABANDONED">Abandoned</option>
                    </select> */}
                    {item.status}
                  </td>

                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                  <td>
                    <button
                      onClick={() => handleToggleArchive(item)}
                      className={item.archived ? "text-green-600 hover:underline" : "text-red-600 hover:underline"}
                    >
                      {item.archived ? "Reactivate" : "Deactivate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}