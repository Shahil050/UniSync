"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PeerCard, type Peer } from "../shared/PeerCard";
import { PeerProfileModal } from "../shared/PeerProfileModal";
import { Filter, Search } from "lucide-react";
import { usersApi } from "@/src/lib/api/users";
import { ApiError } from "@/src/lib/api-client";

const FACULTIES = [
  "All",
  "Computer Engineering",
  "Information Technology",
  "Software Engineering",
];

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
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  const handleMessage = (id: string) => {
    router.push(`/messages?dm=${id}`);
  };

  const handleViewProfile = (id: string) => {
    setViewingProfileId(id);
  };

  // Load AI Recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const res = await usersApi.discover();

        // Remove duplicate users
        const uniqueUsers = Array.from(
          new Map(res.users.map((u: any) => [u.id, u])).values()
        );

        setRecommended(
          uniqueUsers.map((u: any) =>
            toPeer(u, u.similarityScore)
          )
        );
      } catch (err) {
        console.error("Could not load recommendations:", err);
      } finally {
        setLoadingRecommended(false);
      }
    };

    loadRecommendations();
  }, []);

  // Load Student Directory
  const loadDirectory = useCallback(async () => {
    setLoadingDirectory(true);
    setError("");

    try {
      const res = await usersApi.list({
        search: search || undefined,
        department: faculty !== "All" ? faculty : undefined,
      });

      const allStudents = res.users.map((u: any) => toPeer(u));

      // Remove students already shown in recommendations
      const recommendedIds = new Set(
        recommended.map((peer: Peer) => peer.id)
      );

      const filteredStudents = allStudents.filter(
        (peer: Peer) => !recommendedIds.has(peer.id)
      );

      setDirectory(filteredStudents);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not load students."
      );
    } finally {
      setLoadingDirectory(false);
    }
  }, [search, faculty, recommended]);

  useEffect(() => {
    const timer = setTimeout(loadDirectory, 350);
    return () => clearTimeout(timer);
  }, [loadDirectory]);

  return (
    <div className="space-y-8">
      {/* Recommended Peers */}
      {(loadingRecommended || recommended.length > 0) && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Recommended Peers
          </h2>

          {loadingRecommended ? (
            <p className="text-slate-400">
              Finding your best matches...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((peer) => (
                <PeerCard
                  key={peer.id}
                  peer={peer}
                  onMessage={handleMessage}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Student Directory */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <h2 className="text-xl font-bold text-slate-800">
            All Students
          </h2>

          <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
            {/* <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-64 pl-9 pr-3 py-2 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            <div className="flex items-center gap-1 p-1 bg-blue-50 rounded-xl">
              <Filter
                size={14}
                className="text-blue-500 ml-1"
              />

              {FACULTIES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFaculty(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    faculty === f
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {f === "All" ? f : f.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {loadingDirectory ? (
          <p className="text-slate-400">
            Loading students...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {directory.map((peer) => (
                <PeerCard
                  key={peer.id}
                  peer={peer}
                  onMessage={handleMessage}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>

            {directory.length === 0 && (
              <p className="text-center text-slate-400 py-8">
                No students found.
              </p>
            )}
          </>
        )}
      </section>

      {viewingProfileId && (
        <PeerProfileModal
          userId={viewingProfileId}
          onClose={() => setViewingProfileId(null)}
          onMessage={(id) => {
            setViewingProfileId(null);
            handleMessage(id);
          }}
        />
      )}
    </div>
  );
}