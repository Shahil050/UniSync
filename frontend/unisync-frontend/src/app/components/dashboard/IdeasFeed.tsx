"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Heart, MessageCircle, UserPlus, BookOpen, Clock, Tag } from "lucide-react";

type Idea = {
  id: number;
  author: string;
  avatar: string;
  faculty: string;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  postedAt: string;
  isLiked: boolean;
  isRequested: boolean;
};

const MOCK_IDEAS: Idea[] = [
  {
    id: 1,
    author: "Priya Thapa",
    avatar: "https://i.pravatar.cc/40?img=5",
    faculty: "Computer Engineering",
    title: "AI-Powered Crop Disease Detection System",
    description: "Building a CNN-based mobile app to detect crop diseases from photos. Looking for 2 collaborators with ML and mobile dev experience.",
    tags: ["AI", "Machine Learning", "Mobile Dev"],
    likes: 34,
    comments: 12,
    postedAt: "2h ago",
    isLiked: false,
    isRequested: false,
  },
  {
    id: 2,
    author: "Roshan Karki",
    avatar: "https://i.pravatar.cc/40?img=8",
    faculty: "IT",
    title: "Decentralized Academic Credential Verification",
    description: "Using blockchain to create tamper-proof academic records for Pokhara University students. Need 1 backend developer.",
    tags: ["Blockchain", "Web3", "Backend"],
    likes: 22,
    comments: 7,
    postedAt: "5h ago",
    isLiked: true,
    isRequested: false,
  },
  {
    id: 3,
    author: "Sita Rana",
    avatar: "https://i.pravatar.cc/40?img=12",
    faculty: "Software Engineering",
    title: "Real-Time Campus Event Aggregator",
    description: "A platform to aggregate and notify students about campus events, deadlines, and announcements in real time.",
    tags: ["Web Dev", "Real-time", "React"],
    likes: 18,
    comments: 5,
    postedAt: "1d ago",
    isLiked: false,
    isRequested: true,
  },
];

function IdeaCard({ idea, onToggleLike, onRequest }: {
  idea: Idea;
  onToggleLike: (id: number) => void;
  onRequest: (id: number) => void;
}) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden"
    >
      {/* Author */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <img src={idea.avatar} alt={idea.author} className="w-10 h-10 rounded-xl object-cover border-2 border-blue-100" />
          <div>
            <p className="font-semibold text-slate-800 text-sm">{idea.author}</p>
            <p className="text-blue-500 text-xs">{idea.faculty}</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-slate-400 text-xs">
            <Clock size={12} />
            {idea.postedAt}
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start gap-2 mb-2">
          <BookOpen size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <h3 className="font-bold text-slate-800 text-base leading-snug">{idea.title}</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mb-3 pl-6">{idea.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pl-6 mb-4">
          {idea.tags.map((t) => (
            <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              <Tag size={10} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-blue-50 px-5 py-3 flex items-center gap-4">
        <button
          onClick={() => onToggleLike(idea.id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            idea.isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-400"
          }`}
        >
          <Heart size={16} fill={idea.isLiked ? "currentColor" : "none"} />
          {idea.likes + (idea.isLiked ? 1 : 0)}
        </button>

        <button
          onClick={() => setCommentOpen(!commentOpen)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={16} />
          {idea.comments}
        </button>

        <button
          onClick={() => onRequest(idea.id)}
          className={`ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
            idea.isRequested
              ? "bg-green-100 text-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <UserPlus size={14} />
          {idea.isRequested ? "Requested ✓" : "Request to Join"}
        </button>
      </div>

      {/* Comment box */}
      {commentOpen && (
        <div className="border-t border-blue-50 px-5 py-3 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setComment("")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Post
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function IdeasFeed() {
  const [ideas, setIdeas] = useState(MOCK_IDEAS);

  const toggleLike = (id: number) => {
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, isLiked: !i.isLiked } : i));
  };

  const requestJoin = (id: number) => {
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, isRequested: true } : i));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800 text-lg">Posted Ideas</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <BookOpen size={14} />
          Post an Idea
        </button>
      </div>
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} onToggleLike={toggleLike} onRequest={requestJoin} />
      ))}
    </div>
  );
}
