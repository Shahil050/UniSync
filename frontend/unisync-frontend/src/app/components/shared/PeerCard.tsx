"use client";
import { motion } from "motion/react";
import { Github, Linkedin, Users, Star, MessageCircle } from "lucide-react";

export type Peer = {
  id: number;
  name: string;
  avatar: string;
  faculty: string;
  interests: string[];
  reputation: number;
  github?: string;
  linkedin?: string;
  sharedInterests?: number;
  isConnected?: boolean;
};

type PeerCardProps = {
  peer: Peer;
  onConnect?: (id: number) => void;
  onMessage?: (id: number) => void;
  compact?: boolean;
};

export function PeerCard({ peer, onConnect, onMessage, compact }: PeerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md overflow-hidden transition-shadow"
    >
      {/* Cover gradient */}
      <div className="h-16 bg-gradient-to-r from-blue-600 to-blue-800" />

      <div className="px-5 pb-5 -mt-8">
        <div className="flex items-end justify-between mb-3">
          <img
            src={peer.avatar}
            alt={peer.name}
            className="w-16 h-16 rounded-2xl border-4 border-white object-cover shadow-md"
          />
          <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
            <Star size={14} fill="currentColor" />
            {peer.reputation.toFixed(1)}
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-base">{peer.name}</h3>
        <p className="text-blue-600 text-xs font-medium mb-2">{peer.faculty}</p>

        {peer.sharedInterests !== undefined && peer.sharedInterests > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <Users size={12} />
            <span>{peer.sharedInterests} shared interests</span>
          </div>
        )}

        {/* Interests */}
        {!compact && (
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

        {/* Links */}
        <div className="flex items-center gap-2 mb-4">
          {peer.github && (
            <a href={peer.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-600 transition-colors">
              <Github size={12} />
              GitHub
            </a>
          )}
          {peer.linkedin && (
            <a href={peer.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs text-blue-600 transition-colors">
              <Linkedin size={12} />
              LinkedIn
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onConnect?.(peer.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              peer.isConnected
                ? "bg-blue-100 text-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {peer.isConnected ? "Connected ✓" : "Connect"}
          </button>
          {onMessage && (
            <button
              onClick={() => onMessage(peer.id)}
              className="p-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
            >
              <MessageCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
