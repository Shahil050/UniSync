import { useState } from "react";
import { motion } from "motion/react";
import { PeerCard, type Peer } from "../components/shared/PeerCard";
import { SearchBar } from "../components/shared/SearchBar";
import { Footer } from "../components/Footer";
import { Compass, Filter, SlidersHorizontal } from "lucide-react";

const ALL_PEERS: Peer[] = [
  { id: 1, name: "Priya Thapa", avatar: "https://i.pravatar.cc/80?img=5", faculty: "Computer Engineering", interests: ["Machine Learning", "Computer Vision", "Python"], reputation: 4.9, github: "#", linkedin: "#", sharedInterests: 3, isConnected: false },
  { id: 2, name: "Roshan Karki", avatar: "https://i.pravatar.cc/80?img=8", faculty: "Information Technology", interests: ["Blockchain", "Web3", "Backend Dev"], reputation: 4.7, github: "#", sharedInterests: 2, isConnected: true },
  { id: 3, name: "Sita Rana", avatar: "https://i.pravatar.cc/80?img=12", faculty: "Software Engineering", interests: ["Web Development", "React", "UI/UX"], reputation: 4.6, linkedin: "#", sharedInterests: 4, isConnected: false },
  { id: 4, name: "Bikash Gurung", avatar: "https://i.pravatar.cc/80?img=11", faculty: "Computer Engineering", interests: ["Cybersecurity", "Networking", "Linux"], reputation: 4.8, github: "#", linkedin: "#", sharedInterests: 1, isConnected: false },
  { id: 5, name: "Anisha Basnet", avatar: "https://i.pravatar.cc/80?img=16", faculty: "Information Technology", interests: ["Data Science", "Visualization", "Statistics"], reputation: 4.5, linkedin: "#", sharedInterests: 2, isConnected: false },
  { id: 6, name: "Dipesh Magar", avatar: "https://i.pravatar.cc/80?img=15", faculty: "Software Engineering", interests: ["Mobile Dev", "Flutter", "Firebase"], reputation: 4.4, github: "#", sharedInterests: 1, isConnected: false },
  { id: 7, name: "Kabita Shrestha", avatar: "https://i.pravatar.cc/80?img=25", faculty: "Computer Engineering", interests: ["AI", "NLP", "Research"], reputation: 4.3, linkedin: "#", sharedInterests: 3, isConnected: false },
  { id: 8, name: "Nabin Rai", avatar: "https://i.pravatar.cc/80?img=18", faculty: "Information Technology", interests: ["Cloud Computing", "AWS", "DevOps"], reputation: 4.6, github: "#", linkedin: "#", sharedInterests: 0, isConnected: false },
  { id: 9, name: "Rekha Adhikari", avatar: "https://i.pravatar.cc/80?img=20", faculty: "Software Engineering", interests: ["Testing", "QA", "Automation"], reputation: 4.2, github: "#", sharedInterests: 1, isConnected: false },
];

const FACULTIES = ["All", "Computer Engineering", "Information Technology", "Software Engineering"];
const INTERESTS_FILTERS = ["All", "AI/ML", "Web Dev", "Cybersecurity", "Mobile Dev", "Data Science"];

export function DiscoverPage() {
  const [peers, setPeers] = useState(ALL_PEERS);
  const [faculty, setFaculty] = useState("All");
  const [interest, setInterest] = useState("All");

  const handleConnect = (id: number) => {
    setPeers((prev) => prev.map((p) => p.id === id ? { ...p, isConnected: !p.isConnected } : p));
  };

  const filtered = peers.filter((p) => {
    const matchFaculty = faculty === "All" || p.faculty === faculty;
    const matchInterest =
      interest === "All" ||
      (interest === "AI/ML" && p.interests.some((i) => i.toLowerCase().includes("ai") || i.toLowerCase().includes("machine") || i.toLowerCase().includes("learning"))) ||
      (interest === "Web Dev" && p.interests.some((i) => i.toLowerCase().includes("web") || i.toLowerCase().includes("react"))) ||
      (interest === "Cybersecurity" && p.interests.some((i) => i.toLowerCase().includes("cyber") || i.toLowerCase().includes("security"))) ||
      (interest === "Mobile Dev" && p.interests.some((i) => i.toLowerCase().includes("mobile") || i.toLowerCase().includes("flutter"))) ||
      (interest === "Data Science" && p.interests.some((i) => i.toLowerCase().includes("data")));
    return matchFaculty && matchInterest;
  });

  return (
    <div className="min-h-screen bg-blue-50/50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <Compass size={24} />
            <h1 className="text-3xl font-black">Discover Peers</h1>
          </motion.div>
          <p className="text-blue-200 mb-6">Find Pokhara University students with shared interests and skills.</p>
          <SearchBar placeholder="Search by name, skill, or interest..." className="max-w-xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-8 bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <SlidersHorizontal size={16} />
            <span className="text-sm font-semibold">Filter:</span>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-1 font-medium">Faculty</p>
            <div className="flex gap-1 flex-wrap">
              {FACULTIES.map((f) => (
                <button
                  key={f}
                  onClick={() => setFaculty(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    faculty === f ? "bg-blue-600 text-white" : "bg-blue-50 text-slate-600 hover:bg-blue-100"
                  }`}
                >
                  {f === "All" ? "All Faculties" : f.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:ml-auto">
            <p className="text-xs text-slate-400 mb-1 font-medium">Interest Area</p>
            <div className="flex gap-1 flex-wrap">
              {INTERESTS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setInterest(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    interest === f ? "bg-blue-600 text-white" : "bg-blue-50 text-slate-600 hover:bg-blue-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <Filter size={15} className="text-blue-400" />
          <p className="text-slate-600 text-sm"><strong>{filtered.length}</strong> peers found</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((peer) => (
            <PeerCard key={peer.id} peer={peer} onConnect={handleConnect} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
