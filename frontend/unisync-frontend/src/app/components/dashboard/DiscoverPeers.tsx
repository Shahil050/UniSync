"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PeerCard, type Peer } from "../shared/PeerCard";
import { SearchBar } from "../shared/SearchBar";
import { Filter, Search, Sparkles } from "lucide-react";
import { usersApi } from "@/src/lib/api/users";
import { ApiError } from "@/src/lib/api-client";

const FACULTIES = ["All", "Computer Engineering", "Information Technology", "Software Engineering"];

function toPeer(u: any, matchScore?: number): Peer {
  return {
    id: u.id,
    name: u.fullName,
    avatar: u.profileImage,
    department: u.department,
    interests: (u.skills ?? []).map((s: any) => s.skill.name),
    github: u.githubUrl,
    linkedin: u.linkedinUrl,
    matchScore,
  };
}

export function DiscoverPeers() {
  const router = useRouter();

  const [recommended, setRecommended] = useState<Peer[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  const [directory, setDirectory] = useState<Peer[]>([]);
  const [loadingDirectory, setLoadingDirectory] = useState(true);
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("All");
  const [error, setError] = useState("");

  const handleMessage = (id: string) => router.push(`/messages?dm=${id}`);

  useEffect(() => {
    usersApi
      .discover()
      .then((res) => setRecommended(res.users.map((u: any) => toPeer(u, u.similarityScore))))
      .catch((err) => {
        // Non-fatal — AI service may be down/unregistered; directory still works independently
        console.error("Could not load recommendations:", err);
      })
      .finally(() => setLoadingRecommended(false));
  }, []);

  const loadDirectory = useCallback(async () => {
    setLoadingDirectory(true);
    setError("");
    try {
      const res = await usersApi.list({
        search: search || undefined,
        department: faculty !== "All" ? faculty : undefined,
      });
      setDirectory(res.users.map((u: any) => toPeer(u)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load students.");
    } finally {
      setLoadingDirectory(false);
    }
  }, [search, faculty]);

  useEffect(() => {
    const debounce = setTimeout(loadDirectory, 350);
    return () => clearTimeout(debounce);
  }, [loadDirectory]);

  return (
    <div className="space-y-8">
      {/* AI Recommendations */}
      {(loadingRecommended || recommended.length > 0) && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-blue-600" />
            <h2 className="font-bold text-slate-800 text-lg">Recommended for You</h2>
          </div>
          {loadingRecommended ? (
            <p className="text-slate-400 text-sm">Finding your matches...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((peer) => (
                <PeerCard key={peer.id} peer={peer} onMessage={handleMessage} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Directory */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <h2 className="font-bold text-slate-800 text-lg">All Students</h2>
          <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search peers..."
                className="w-64 pl-9 pr-3 py-2 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-blue-50 rounded-xl">
              <Filter size={14} className="text-blue-400 ml-1" />
              {FACULTIES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFaculty(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    faculty === f ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-blue-600"
                  }`}
                >
                  {f === "All" ? f : f.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {directory.map((peer) => (
            <PeerCard key={peer.id} peer={peer} onMessage={handleMessage} />
          ))}
        </div>
        {!loadingDirectory && directory.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-8">No students match these filters.</p>
        )}
      </div>
    </div>
  );
}