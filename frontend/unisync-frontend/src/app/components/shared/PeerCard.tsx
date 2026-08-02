"use client";
import { motion } from "motion/react";
import { Github, Linkedin, Sparkles, MessageCircle, User } from "lucide-react";

export type Peer = {
  id: string;
  name: string;
  avatar: string | null;
  department: string | null;
  interests: string[];
  github?: string | null;
  linkedin?: string | null;
  matchScore?: number; // 0–1, only present for AI-recommended peers
};

type PeerCardProps = {
  peer: Peer;
  onMessage: (id: string) => void;
  onViewProfile?: (id: string) => void;
  compact?: boolean;
};

export function PeerCard({ peer, onMessage, onViewProfile, compact }: PeerCardProps) {
  const initials = peer.name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md overflow-hidden transition-shadow"
    >
      <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-800" />

      <div className="px-5 pb-5 -mt-8">
        <div className="flex items-end justify-between mb-3">
          {peer.avatar ? (
            <img src={peer.avatar} alt={peer.name} className="w-16 h-16 rounded-2xl border-4 border-white object-cover shadow-md" />
          ) : (
            <div className="w-16 h-16 rounded-2xl border-4 border-white bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {initials}
            </div>
          )}
          {peer.matchScore !== undefined && (
            <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-full">
              <Sparkles size={12} />
              {Math.round(peer.matchScore * 100)}% match
            </div>
          )}
        </div>

        <h3 className="font-bold text-slate-800 text-base">{peer.name}</h3>
        <p className="text-blue-600 text-xs font-medium mb-2">{peer.department ?? "—"}</p>

        {!compact && peer.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {peer.interests.slice(0, 3).map((interest) => (
              <span key={interest} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                {interest}
              </span>
            ))}
            {peer.interests.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">
                +{peer.interests.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          {peer.github && (
            <a href={peer.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-600 transition-colors">
              <Github size={12} /> GitHub
            </a>
          )}
          {peer.linkedin && (
            <a href={peer.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs text-blue-600 transition-colors">
              <Linkedin size={12} /> LinkedIn
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onViewProfile && (
            <button
              onClick={() => onViewProfile(peer.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all"
            >
              <User size={15} />
              View Profile
            </button>
          )}
          <button
            onClick={() => onMessage(peer.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
          >
            <MessageCircle size={15} />
            Message
          </button>
        </div>
      </div>
    </motion.div>
  );
}