"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, User, BookOpen, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usersApi } from "@/src/lib/api/users";
import { projectsApi } from "@/src/lib/api/projects";

type SearchResult =
  | { type: "peer"; id: string; label: string; sub: string }
  | { type: "project"; id: string; label: string; sub: string }
  | { type: "interest"; id: string; label: string; sub: string };

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const debounce = setTimeout(async () => {
      try {
        const [peersRes, projectsRes, skillsRes] = await Promise.all([
          usersApi.list({ search: query }),
          projectsApi.list({ search: query }),
          usersApi.listSkills(query),
        ]);

        const peers: SearchResult[] = peersRes.users.slice(0, 5).map((u: any) => ({
          type: "peer" as const,
          id: u.id,
          label: u.fullName,
          sub: (u.skills ?? []).map((s: any) => s.skill.name).slice(0, 2).join(", ") || u.department || "",
        }));

        const projects: SearchResult[] = projectsRes.projects.slice(0, 5).map((p: any) => ({
          type: "project" as const,
          id: p.id,
          label: p.title,
          sub: p.description ? p.description.slice(0, 60) : "No description",
        }));

        const interests: SearchResult[] = skillsRes.skills.slice(0, 5).map((s: any) => ({
          type: "interest" as const,
          id: s.id,
          label: s.name,
          sub: s.category ?? "",
        }));

        setResults([...peers, ...projects, ...interests]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (r: SearchResult) => {
    if (r.type === "peer") {
      router.push(`/messages?dm=${r.id}`);
    } else if (r.type === "project") {
      router.push(`/dashboard?tab=ideas`);
    } else {
      setQuery(r.label);
    }
    setOpen(false);
  };

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
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={15} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden z-50"
          >
            {loading && <p className="px-4 py-3 text-sm text-slate-400">Searching...</p>}
            {!loading && results.length === 0 && <p className="px-4 py-3 text-sm text-slate-400">No results.</p>}
            {!loading && results.slice(0, 8).map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {typeIcon[r.type]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{r.label}</p>
                  {r.sub && <p className="text-xs text-slate-400 truncate">{r.sub}</p>}
                </div>
                <span className="ml-auto text-xs text-slate-300 capitalize flex-shrink-0">{r.type}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}