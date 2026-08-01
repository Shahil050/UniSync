"use client";

import { useEffect, useState, useCallback } from "react";
import {
  adminAgreementsApi,
  AdminAgreement,
  AdminAgreementDetail,
  ContractStatus,
} from "@/src/lib/api/admin-agreements";
import { ApiError } from "@/src/lib/api-client";

const STATUS_STYLES: Record<ContractStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  ACTIVE: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  BREACHED: "bg-red-100 text-red-700",
};

export default function Agreements() {
  const [agreements, setAgreements] = useState<AdminAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContractStatus | "">("");

  const [detail, setDetail] = useState<AdminAgreementDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadAgreements = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAgreementsApi.list({
        search: search || undefined,
        status: status || undefined,
      });
      setAgreements(res.agreements);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load agreements.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timeout = setTimeout(loadAgreements, 300);
    return () => clearTimeout(timeout);
  }, [loadAgreements]);

  const openDetail = async (agreement: AdminAgreement) => {
    setDetailLoading(true);
    try {
      const res = await adminAgreementsApi.detail(agreement.id);
      setDetail(res.agreement);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to load agreement.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleVoid = async (agreement: AdminAgreement) => {
    if (!confirm(`Void the agreement for "${agreement.project}"? All members will need to re-sign.`)) return;
    try {
      await adminAgreementsApi.void(agreement.id);
      setDetail(null);
      await loadAgreements();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Digital Agreements</h2>
          <p className="text-slate-500 mt-1">Oversee research collaboration agreements.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Search by project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as ContractStatus | "")}
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="BREACHED">Breached</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Project</th>
              <th>Signed</th>
              <th>Status</th>
              <th>Due Date</th>
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
            ) : agreements.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-5 text-center">
                  No agreements found
                </td>
              </tr>
            ) : (
              agreements.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-4">{a.project}</td>
                  <td>
                    {a.signed}/{a.totalMembers}
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm ${STATUS_STYLES[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—"}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => openDetail(a)} className="text-blue-600 mr-3">
                      View
                    </button>
                    {a.status === "ACTIVE" && (
                      <button onClick={() => handleVoid(a)} className="text-red-600">
                        Void
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(detail || detailLoading) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            {detailLoading || !detail ? (
              <p className="text-slate-500">Loading...</p>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{detail.project}</h3>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${STATUS_STYLES[detail.status]}`}>
                      {detail.status}
                    </span>
                  </div>
                  <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                {detail.content?.summary && (
                  <p className="text-sm text-slate-600 mb-4">{detail.content.summary}</p>
                )}

                <p className="text-sm text-slate-500 mb-2">
                  Due: {detail.dueDate ? new Date(detail.dueDate).toLocaleDateString() : "Not set"}
                </p>

                <h4 className="font-semibold text-slate-700 mt-4 mb-2">Members</h4>
                <div className="space-y-2">
                  {detail.members.map((m) => (
                    <div key={m.userId} className="flex justify-between items-center border rounded-lg px-3 py-2">
                      <div>
                        <p className="font-medium text-sm">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.roleTitle}</p>
                      </div>
                      <span className={m.signedAt ? "text-green-600 text-xs font-semibold" : "text-slate-400 text-xs"}>
                        {m.signedAt ? `Signed ${new Date(m.signedAt).toLocaleDateString()}` : "Not signed"}
                      </span>
                    </div>
                  ))}
                </div>

                {detail.status === "ACTIVE" && (
                  <button
                    onClick={() => handleVoid({ id: detail.id, project: detail.project } as AdminAgreement)}
                    className="mt-5 w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Void Agreement
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}