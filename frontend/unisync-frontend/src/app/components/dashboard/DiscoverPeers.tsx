"use client";
import { useState } from "react";
import { PeerCard, type Peer } from "../shared/PeerCard";
import { SearchBar } from "../shared/SearchBar";
import { Filter } from "lucide-react";

const PEERS: Peer[] = [
  {
    id: 1,
    name: "Kajal kUshwaha",
    avatar: "/kajal.jpg",
    faculty: "Computer Engineering",
    interests: ["Machine Learning", "Computer Vision", "Python"],
    reputation: 4.9,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    sharedInterests: 3,
    isConnected: false,
  },
  {
    id: 2,
    name: "shahil shrestha",
    avatar: "/shahil.jpg",
    faculty: "Information Technology",
    interests: ["Blockchain", "Web3", "Backend Dev"],
    reputation: 4.7,
    github: "https://github.com",
    sharedInterests: 2,
    isConnected: true,
  },
  {
    id: 3,
    name: "Sapana kushwaha",
    avatar: "/sapna.jpg",
    faculty: "Software Engineering",
    interests: ["Web Development", "React", "UI/UX"],
    reputation: 4.6,
    linkedin: "https://linkedin.com",
    sharedInterests: 4,
    isConnected: false,
  },
  {
    id: 4,
    name: "Bikash Mehta",
    avatar: "/bikash.jpg",
    faculty: "Computer Engineering",
    interests: ["Cybersecurity", "Networking", "Linux"],
    reputation: 4.8,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    sharedInterests: 1,
    isConnected: false,
  },
  {
    id: 5,
    name: "Ashish Singh",
    avatar: "/ASHISH MEHTA.jpg",
    faculty: "Information Technology",
    interests: ["Data Science", "Visualization", "Statistics"],
    reputation: 4.5,
    linkedin: "https://linkedin.com",
    sharedInterests: 2,
    isConnected: false,
  },
  {
    id: 6,
    name: "Sushant Joshi",
    avatar: "/sushant.jpg",
    faculty: "Software Engineering",
    interests: ["Mobile Dev", "Flutter", "Firebase"],
    reputation: 4.4,
    github: "https://github.com",
    sharedInterests: 1,
    isConnected: false,
  },
];
const FILTERS = ["All", "Computer Engineering", "Information Technology", "Software Engineering"];

export function DiscoverPeers() {
  const [peers, setPeers] = useState(PEERS);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? peers : peers.filter((p) => p.faculty === activeFilter);

  const handleConnect = (id: number) => {
    setPeers((prev) => prev.map((p) => p.id === id ? { ...p, isConnected: !p.isConnected } : p));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <h2 className="font-bold text-slate-800 text-lg">Discover Peers</h2>
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          <SearchBar placeholder="Search peers..." className="w-64" />
          <div className="flex items-center gap-1 p-1 bg-blue-50 rounded-xl">
            <Filter size={14} className="text-blue-400 ml-1" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === f ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-blue-600"
                }`}
              >
                {f === "All" ? f : f.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((peer) => (
          <PeerCard
            key={peer.id}
            peer={peer}
            onConnect={handleConnect}
          />
        ))}
      </div>
    </div>
  );
}
