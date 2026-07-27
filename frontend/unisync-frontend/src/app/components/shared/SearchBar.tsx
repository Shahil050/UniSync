"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, User, BookOpen, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type SearchResult = {
  type: "peer" | "project" | "interest";
  label: string;
  sub?: string;
};

const MOCK_RESULTS: SearchResult[] = [
  { type: "peer", label: "Aarav Sharma", sub: "AI, Machine Learning" },
  { type: "peer", label: "Priya Thapa", sub: "Web Development, React" },
  { type: "peer", label: "Bikash Gurung", sub: "Cybersecurity" },
  { type: "project", label: "AI-Powered Crop Disease Detector", sub: "Looking for collaborators" },
  { type: "project", label: "Real-Time Chat App", sub: "2 collaborators needed" },
  { type: "interest", label: "Machine Learning", sub: "48 students interested" },
  { type: "interest", label: "Blockchain", sub: "23 students interested" },
];

const typeIcon = {
  peer: <User size={14} className="text-blue-500" />,
  project: <BookOpen size={14} className="text-cyan-500" />,
  interest: <Tag size={14} className="text-sky-500" />,
};

type SearchBarProps = {
  placeholder?: string;
  className?: string;
};

export function SearchBar({ placeholder = "Search peers, projects, interests...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = MOCK_RESULTS.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase()) ||
    r.sub?.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && query && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden z-50"
          >
            {filtered.slice(0, 6).map((r, i) => (
              <button
                key={i}
                onClick={() => { setQuery(r.label); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {typeIcon[r.type]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{r.label}</p>
                  {r.sub && <p className="text-xs text-slate-400">{r.sub}</p>}
                </div>
                <span className="ml-auto text-xs text-slate-300 capitalize">{r.type}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
