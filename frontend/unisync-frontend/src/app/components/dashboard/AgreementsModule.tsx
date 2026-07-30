"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileSignature, CheckCircle2, XCircle, Clock, Users, AlertTriangle, X, Edit3 } from "lucide-react";
import { projectsApi } from "@/src/lib/api/projects";
import { ApiError } from "@/src/lib/api-client";
import { useUser } from "../../UserContext";

type Role = { userId: string; roleTitle: string; user: { id: string; fullName: string; profileImage: string | null } };
type Signature = { userId: string; signedAt: string };

type ContractData = {
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "BREACHED";
  dueDate: string | null;
  content: { summary?: string; penalties?: string };
  roles: Role[];
  signatures: Signature[];
};

type Agreement = {
  projectId: string;
  projectTitle: string;
  ownerId: string;
  contract: ContractData;
};

const statusConfig = {
  DRAFT: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: <Clock size={13} /> },
  ACTIVE: { label: "Active", color: "bg-blue-100 text-blue-700", icon: <CheckCircle2 size={13} /> },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={13} /> },
  BREACHED: { label: "Breached", color: "bg-red-100 text-red-700", icon: <XCircle size={13} /> },
};

function AgreementModal({
  agreement,
  currentUserId,
  onClose,
  onChanged,
}: {
  agreement: Agreement;
  currentUserId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const { contract } = agreement;
  const hasSigned = contract.signatures.some((s) => s.userId === currentUserId);
  const myRole = contract.roles.find((r) => r.userId === currentUserId);
  const isOwner = agreement.ownerId === currentUserId;
  const canEdit = isOwner && contract.signatures.length === 0;

  const [summary, setSummary] = useState(contract.content.summary ?? "");
  const [penalties, setPenalties] = useState(contract.content.penalties ?? "");
  const [dueDate, setDueDate] = useState(contract.dueDate ? contract.dueDate.slice(0, 10) : "");

  const handleSaveEdit = async () => {
    if (!summary.trim() || !dueDate) {
      setError("Description and deadline are both required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await projectsApi.updateContractContent(agreement.projectId, {
        summary: summary.trim(),
        penalties: penalties.trim(),
        dueDate,
      });
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save changes.");
    } finally {
      setBusy(false);
    }
  };

  const handleSign = async () => {
    setBusy(true);
    setError("");
    try {
      await projectsApi.signContract(agreement.projectId);
      onChanged();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign.");
    } finally {
      setBusy(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Leave this project? You'll no longer be part of the collaboration.")) return;
    setBusy(true);
    setError("");
    try {
      await projectsApi.leave(agreement.projectId);
      onChanged();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not leave project.");
    } finally {
      setBusy(false);
    }
  };

  const cfg = statusConfig[contract.status];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <FileSignature size={18} />
            <span className="font-black text-lg">Collaboration Agreement</span>
          </div>
          <h3 className="text-xl font-bold">{agreement.projectTitle}</h3>
          <p className="text-blue-200 text-sm">Role: {myRole?.roleTitle ?? "—"}</p>
        </div>

        <div className="p-6 space-y-5">
          {error && <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

          {canEdit && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:underline"
            >
              <Edit3 size={14} /> Edit Terms
            </button>
          )}

          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Deadline *</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Penalty Rules (optional)</label>
                <textarea
                  value={penalties}
                  onChange={(e) => setPenalties(e.target.value)}
                  rows={2}
                  placeholder="e.g. Missing 3+ meetings results in removal."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={busy}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {busy ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h4 className="font-semibold text-slate-700 text-sm mb-2">Description</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{contract.content.summary || "No description set."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-700 text-sm mb-1">Deadline</h4>
                  <p className="text-slate-600 text-sm">
                    {contract.dueDate ? new Date(contract.dueDate).toLocaleDateString() : "No deadline set"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 text-sm mb-1">Status</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                    {cfg.icon}
                    {cfg.label}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
                  <Users size={14} />
                  Members
                </h4>
                <div className="space-y-2">
                  {contract.roles.map((r) => {
                    const signed = contract.signatures.some((s) => s.userId === r.userId);
                    return (
                      <div key={r.userId} className="flex items-center gap-3 p-2 bg-blue-50 rounded-xl">
                        {r.user.profileImage ? (
                          <img src={r.user.profileImage} alt={r.user.fullName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">
                            {r.user.fullName.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className="text-slate-700 text-sm font-medium">{r.user.fullName}</span>
                        <span className="text-slate-400 text-xs">({r.roleTitle})</span>
                        <span className={`ml-auto text-xs font-semibold ${signed ? "text-green-600" : "text-amber-600"}`}>
                          {signed ? "✓ Signed" : "⏳ Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {contract.content.penalties && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-700 text-sm">Penalty Rules</p>
                      <p className="text-amber-600 text-xs mt-0.5">{contract.content.penalties}</p>
                    </div>
                  </div>
                </div>
              )}

              {!hasSigned && myRole && (
                <div className="flex gap-3">
                  <button onClick={handleSign} disabled={busy} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm disabled:opacity-50">
                    Accept & Sign
                  </button>
                  <button onClick={handleLeave} disabled={busy} className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors text-sm disabled:opacity-50">
                    Decline & Leave
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function AgreementsModule() {
  const { user } = useUser();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Agreement | null>(null);

  const load = useCallback(async () => {
    try {
      const projectsRes = await projectsApi.list({ mine: true });
      const activeProjects = projectsRes.projects.filter((p: any) =>
        p.members.some((m: any) => m.userId === user.id && m.status === "ACTIVE")
      );

      const results = await Promise.allSettled(
        activeProjects.map(async (p: any) => {
          const res = await projectsApi.getContract(p.id);
          return { projectId: p.id, projectTitle: p.title, ownerId: p.ownerId, contract: res.contract };
        })
      );

      const loaded = results
        .filter((r): r is PromiseFulfilledResult<Agreement> => r.status === "fulfilled")
        .map((r) => r.value);

      setAgreements(loaded);
      setSelected((prev) => (prev ? loaded.find((a) => a.projectId === prev.projectId) ?? null : null));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load agreements.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="space-y-4">
        <h2 className="font-bold text-slate-800 text-lg">Agreements</h2>

        {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
        {loading && <p className="text-slate-400 text-sm">Loading agreements...</p>}
        {!loading && agreements.length === 0 && (
          <p className="text-slate-400 text-sm">No agreements yet. Join or post a project to get one.</p>
        )}

        {agreements.map((ag, i) => {
          const cfg = statusConfig[ag.contract.status];
          const myRole = ag.contract.roles.find((r) => r.userId === user.id);
          return (
            <motion.div
              key={ag.projectId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(ag)}
              className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">{ag.projectTitle}</h3>
                  <p className="text-blue-500 text-xs font-medium">{myRole?.roleTitle ?? "—"}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                  {cfg.icon}
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users size={13} />
                  <span className="text-xs">{ag.contract.roles.length} members</span>
                </div>
                {ag.contract.dueDate ? (
                  <div className="flex items-center gap-1">
                    <Clock size={13} />
                    <span className="text-xs">{new Date(ag.contract.dueDate).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-600 font-medium">No deadline set</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <AgreementModal agreement={selected} currentUserId={user.id} onClose={() => setSelected(null)} onChanged={load} />
        )}
      </AnimatePresence>
    </>
  );
}