"use client";

import { useEffect, useState, useCallback } from "react";
import { papersApi, AdminPaper } from "@/src/lib/api/papers";
import { PaperUploadPanel } from "../dashboard/PaperUploadPanel";
import { ApiError } from "@/src/lib/api-client";

export default function Papers() {
  const [papers, setPapers] = useState<AdminPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadPapers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await papersApi.adminList(search || undefined);
      setPapers(res.papers);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load papers.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(loadPapers, 300);
    return () => clearTimeout(timeout);
  }, [loadPapers]);

  const handleDelete = async (paper: AdminPaper) => {
    if (!confirm(`Permanently delete "${paper.title}"? This can't be undone.`)) return;
    try {
      await papersApi.adminDelete(paper.id);
      await loadPapers();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Research Paper Management</h2>

        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "Close" : "+ Add Paper"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <PaperUploadPanel
            onUploaded={() => {
              setShowForm(false);
              loadPapers();
            }}
          />
        </div>
      )}

      <input
        placeholder="Search papers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 mb-4 w-full max-w-sm"
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th>Authors</th>
            <th>Added By</th>
            <th>Date Added</th>
            <th>Source</th>
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
          ) : papers.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-5 text-center">
                No papers found
              </td>
            </tr>
          ) : (
            papers.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.title}</td>
                <td>{item.authors ?? "—"}</td>
                <td>{item.addedBy}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      Link
                    </a>
                  ) : (
                    <a
                      href={papersApi.fileUrl(item.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      PDF
                    </a>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(item)} className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}