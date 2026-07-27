"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileSignature, CheckCircle2, XCircle, Clock, Users, AlertTriangle, X } from "lucide-react";

type Agreement = {
  id: number;
  project: string;
  status: "Pending" | "Active" | "Completed" | "Abandoned";
  role: string;
  peers: { name: string; avatar: string; accepted: boolean }[];
  deadline: string;
  description: string;
  penalties: string;
};

const AGREEMENTS: Agreement[] = [
  {
    id: 1,
    project: "AI Crop Disease Detector",
    status: "Active",
    role: "Project Lead",
    peers: [
      {
        name: "Sapna Kushwaha.",
        avatar: "/sapna.jpg",
        accepted: true,
      },
      {
        name: "Bikash G.",
        avatar: "/bikash.jpg",
        accepted: true,
      },
    ],
    deadline: "Jun 30, 2025",
    description:
      "Develop a CNN model to identify crop diseases from photos. All members contribute equally to training and evaluation.",
    penalties:
      "Missing 3+ meetings results in removal and Abandonment Tag.",
  },
  {
    id: 2,
    project: "Campus Event Aggregator",
    status: "Pending",
    role: "Contributor",
    peers: [
      {
        name: "Hina Tamarakar.",
        avatar: "/hina.jpg",
        accepted: true,
      },
      {
        name: "Rabindra yadav.",
        avatar: "/rabindra.jpg",
        accepted: false,
      },
    ],
    deadline: "Jul 15, 2025",
    description:
      "Build a real-time notification system for campus events using React and WebSockets.",
    penalties:
      "Incomplete tasks by deadline result in reduced reputation score.",
  },
];

const statusConfig = {
  Pending: { color: "bg-amber-100 text-amber-700", icon: <Clock size={13} /> },
  Active: { color: "bg-blue-100 text-blue-700", icon: <CheckCircle2 size={13} /> },
  Completed: { color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={13} /> },
  Abandoned: { color: "bg-red-100 text-red-700", icon: <XCircle size={13} /> },
};

function AgreementModal({ agreement, onClose }: { agreement: Agreement; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10"
      >
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <FileSignature size={18} />
            <span className="font-black text-lg">Collaboration Agreement</span>
          </div>
          <h3 className="text-xl font-bold">{agreement.project}</h3>
          <p className="text-blue-200 text-sm">Role: {agreement.role}</p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h4 className="font-semibold text-slate-700 text-sm mb-2">Description</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{agreement.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-700 text-sm mb-1">Deadline</h4>
              <p className="text-slate-600 text-sm">{agreement.deadline}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 text-sm mb-1">Status</h4>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[agreement.status].color}`}>
                {statusConfig[agreement.status].icon}
                {agreement.status}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-2">
              <Users size={14} />
              Members
            </h4>
            <div className="space-y-2">
              {agreement.peers.map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-2 bg-blue-50 rounded-xl">
                  <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-slate-700 text-sm font-medium">{p.name}</span>
                  <span className={`ml-auto text-xs font-semibold ${p.accepted ? "text-green-600" : "text-amber-600"}`}>
                    {p.accepted ? "✓ Accepted" : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-700 text-sm">Penalty Rules</p>
                <p className="text-amber-600 text-xs mt-0.5">{agreement.penalties}</p>
              </div>
            </div>
          </div>

          {agreement.status === "Pending" && (
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
                Accept Agreement
              </button>
              <button className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors text-sm">
                Reject
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function AgreementsModule() {
  const [selected, setSelected] = useState<Agreement | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">Agreements</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            <FileSignature size={14} />
            New Agreement
          </button>
        </div>

        {AGREEMENTS.map((ag, i) => (
          <motion.div
            key={ag.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(ag)}
            className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800">{ag.project}</h3>
                <p className="text-blue-500 text-xs font-medium">{ag.role}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[ag.status].color}`}>
                {statusConfig[ag.status].icon}
                {ag.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Users size={13} />
                <div className="flex -space-x-1">
                  {ag.peers.map((p) => (
                    <img key={p.name} src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <span className="text-xs">{ag.peers.length} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={13} />
                <span className="text-xs">{ag.deadline}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <AgreementModal agreement={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
