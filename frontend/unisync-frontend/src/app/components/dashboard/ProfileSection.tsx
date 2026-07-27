"use client";

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Award,
  Edit3,
  Camera,
  ExternalLink,
  Send,
  ThumbsUp,
  MessageSquare,
  Share2,
  Lightbulb,
  Trash2,
  X,
  Check,
} from "lucide-react";
import type { AppUser } from "../../App";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface IdeaPost {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
}

const BADGES = [
  { label: "AI Explorer", color: "bg-blue-500", earned: true },
  { label: "Team Player", color: "bg-cyan-500", earned: true },
  { label: "Code Champion", color: "bg-sky-600", earned: true },
  { label: "Idea Starter", color: "bg-blue-700", earned: false },
];

const INITIAL_IDEAS: IdeaPost[] = [
  {
    id: "1",
    content:
      "Working on a new AI crop disease detection model using ResNet50! Looking for peer feedback on dataset pre-processing and augmentations.",
    createdAt: "2 hours ago",
    likes: 12,
    comments: [
      {
        id: "c1",
        author: "Priya T.",
        text: "Try using RandAugment or Mixup for rotation and color jittering. Worked great for our project!",
        createdAt: "1 hour ago",
      },
    ],
    isLiked: false,
  },
  {
    id: "2",
    content:
      "Excited to launch our real-time chat prototype built with Next.js, WebSockets, and Tailwind CSS. Check out our project history below!",
    createdAt: "2 days ago",
    likes: 24,
    comments: [],
    isLiked: true,
  },
];

const PROJECTS = [
  {
    name: "AI Crop Disease Detector",
    status: "Completed",
    start: "Jan 2025",
    end: "Apr 2025",
    peers: ["Priya T.", "Bikash G."],
    badge: true,
  },
  {
    name: "Real-Time Chat System",
    status: "Active",
    start: "May 2025",
    end: "—",
    peers: ["Roshan K."],
    badge: false,
  },
];

const formatUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

export function ProfileSection({
  user,
  setUser,
}: {
  user: AppUser;
  setUser: Dispatch<SetStateAction<AppUser>>;
}) {
  const [editing, setEditing] = useState(false);

  // Profile Form State
  const [bio, setBio] = useState(user.bio || "");
  const [github, setGithub] = useState(user.github || "");
  const [linkedin, setLinkedin] = useState(user.linkedin || "");
  const [portfolio, setPortfolio] = useState(user.portfolio || "");

  // Image Upload State
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || "/kajal.jpg");
  const [coverUrl, setCoverUrl] = useState<string | null>(user.coverUrl || null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Ideas & Comments State
  const [ideas, setIdeas] = useState<IdeaPost[]>(INITIAL_IDEAS);
  const [newIdeaText, setNewIdeaText] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  useEffect(() => {
    setBio(user.bio || "");
    setGithub(user.github || "");
    setLinkedin(user.linkedin || "");
    setPortfolio(user.portfolio || "");
    if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
    if (user.coverUrl) setCoverUrl(user.coverUrl);
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (avatarUrl.startsWith("blob:")) URL.revokeObjectURL(avatarUrl);
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (coverUrl && coverUrl.startsWith("blob:")) URL.revokeObjectURL(coverUrl);
      const imageUrl = URL.createObjectURL(file);
      setCoverUrl(imageUrl);
    }
  };

  const handleSaveProfile = () => {
    setUser((prev) => ({
      ...prev,
      bio,
      github,
      linkedin,
      portfolio,
      avatarUrl,
      coverUrl: coverUrl || undefined,
    }));
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setBio(user.bio || "");
    setGithub(user.github || "");
    setLinkedin(user.linkedin || "");
    setPortfolio(user.portfolio || "");
    setEditing(false);
  };

  const handlePostIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim()) return;

    const newPost: IdeaPost = {
      id: Date.now().toString(),
      content: newIdeaText.trim(),
      createdAt: "Just now",
      likes: 0,
      comments: [],
      isLiked: false,
    };

    setIdeas([newPost, ...ideas]);
    setNewIdeaText("");
  };

  const toggleLike = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === id) {
          const isLiked = !idea.isLiked;
          return {
            ...idea,
            isLiked,
            likes: isLiked ? idea.likes + 1 : idea.likes - 1,
          };
        }
        return idea;
      })
    );
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: user.name,
      text,
      createdAt: "Just now",
    };

    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === postId
          ? { ...idea, comments: [...idea.comments, newComment] }
          : idea
      )
    );

    setCommentInput((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        {/* Cover Background Header */}
        <div
          className="h-28 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 relative bg-cover bg-center"
          style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : {}}
        >
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-xl text-white transition-colors"
            title="Change Cover Photo"
            type="button"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            {/* Avatar Image Container */}
            <div className="relative">
              <Image
                src={avatarUrl}
                alt={user.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors border-2 border-white shadow"
                title="Change Profile Picture"
                type="button"
              >
                <Camera size={12} />
              </button>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Edit / Save Actions */}
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Check size={14} />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="mb-4">
            <h2 className="font-black text-slate-800 text-xl">{user.name}</h2>
            <p className="text-blue-600 text-sm font-medium">
              Computer Engineering · Pokhara University
            </p>
            <p className="text-slate-400 text-xs">{user.email}</p>
          </div>

          {/* Bio Section */}
          <div className="mb-4">
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            ) : (
              <p className="text-slate-600 text-sm leading-relaxed">
                {bio || "No bio added yet."}
              </p>
            )}
          </div>

          {/* Social Links Section */}
          <div className="mb-5">
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="GitHub Profile URL"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="LinkedIn Profile URL"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Portfolio Website URL"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {github && (
                  <a
                    href={formatUrl(github)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-700 font-medium transition-colors"
                  >
                    <Github size={15} />
                    GitHub
                    <ExternalLink size={11} />
                  </a>
                )}

                {linkedin && (
                  <a
                    href={formatUrl(linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 font-medium transition-colors"
                  >
                    <Linkedin size={15} />
                    LinkedIn
                    <ExternalLink size={11} />
                  </a>
                )}

                {portfolio && (
                  <a
                    href={formatUrl(portfolio)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-cyan-50 hover:bg-cyan-100 rounded-xl text-sm text-cyan-700 font-medium transition-colors"
                  >
                    <ExternalLink size={15} />
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Badges */}
          <div>
            <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <span
                  key={b.label}
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    b.earned ? b.color : "bg-slate-300 text-slate-600 line-through"
                  }`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share an Idea Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="text-amber-500" size={20} />
          <h3 className="font-bold text-slate-800 text-base">Share an Idea or Update</h3>
        </div>
        <form onSubmit={handlePostIdea} className="space-y-3">
          <textarea
            value={newIdeaText}
            onChange={(e) => setNewIdeaText(e.target.value)}
            placeholder={`What's on your mind, ${user.name.split(" ")[0]}? Share an idea or research thought...`}
            className="w-full px-4 py-3 border border-blue-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50/50"
            rows={3}
          />
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-slate-400 font-medium">Text posts only</span>
            <button
              type="submit"
              disabled={!newIdeaText.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              Post Idea
            </button>
          </div>
        </form>
      </div>

      {/* Posted Ideas Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Posted Ideas & Activity</h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
            {ideas.length} {ideas.length === 1 ? "Idea" : "Ideas"}
          </span>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-blue-100 rounded-xl">
            <Lightbulb className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-500 text-sm font-medium">No ideas posted yet.</p>
            <p className="text-slate-400 text-xs mt-1">
              Use the box above to share your first idea!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => {
              const isCommenting = activeCommentPostId === idea.id;

              return (
                <div
                  key={idea.id}
                  className="border border-blue-100 rounded-xl p-4 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={avatarUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border border-blue-100"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">
                          {user.name}
                        </h4>
                        <p className="text-slate-400 text-xs">{idea.createdAt}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete idea"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                    {idea.content}
                  </p>

                  {/* Like / Comment Actions */}
                  <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-slate-500 text-xs">
                    <button
                      onClick={() => toggleLike(idea.id)}
                      className={`flex items-center gap-1.5 font-medium transition-colors ${
                        idea.isLiked ? "text-blue-600" : "hover:text-blue-600"
                      }`}
                    >
                      <ThumbsUp
                        size={14}
                        className={idea.isLiked ? "fill-blue-600" : ""}
                      />
                      <span>{idea.likes} Likes</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentPostId(isCommenting ? null : idea.id)
                      }
                      className="flex items-center gap-1.5 font-medium hover:text-blue-600 transition-colors"
                    >
                      <MessageSquare size={14} />
                      <span>{idea.comments.length} Comments</span>
                    </button>

                    <div className="flex items-center gap-1.5 font-medium hover:text-blue-600 transition-colors cursor-pointer">
                      <Share2 size={14} />
                      <span>Share</span>
                    </div>
                  </div>

                  {/* Expandable Comments Feed */}
                  {isCommenting && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                      {idea.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-slate-50 p-3 rounded-xl text-xs space-y-1"
                        >
                          <div className="flex justify-between font-semibold text-slate-700">
                            <span>{comment.author}</span>
                            <span className="text-slate-400 font-normal">
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      ))}

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInput[idea.id] || ""}
                          onChange={(e) =>
                            setCommentInput((prev) => ({
                              ...prev,
                              [idea.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(idea.id);
                          }}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddComment(idea.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project History */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4">Project History</h3>
        <div className="space-y-4">
          {PROJECTS.map((p) => (
            <div key={p.name} className="border border-blue-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{p.name}</h4>
                  <p className="text-slate-400 text-xs">
                    {p.start} → {p.end}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    p.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">With:</span>
                {p.peers.map((peer) => (
                  <span
                    key={peer}
                    className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium"
                  >
                    {peer}
                  </span>
                ))}
                {p.badge && (
                  <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Award size={12} /> Badge Earned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}