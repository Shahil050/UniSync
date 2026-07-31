"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send, Paperclip, Image as ImageIcon, Smile, Users, Github, Trello, FileText, ExternalLink, MoreVertical, File, X, Edit3,
  CheckCircle, User as UserIcon, Globe, UserPlus, Trash2, Crown, BellOff, Bell, Trash, LogOut, Info, ShieldAlert, FolderOpen,
  Plus, Download, Camera,
  User,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { AppUser } from "../../UserContext";
import { messagesApi } from "@/src/lib/api/messages";
import { projectsApi } from "@/src/lib/api/projects";
import { usersApi } from "@/src/lib/api/users";
import { ApiError } from "@/src/lib/api-client";

// --- TYPES ---
type Conversation = {
  type: "group" | "dm";
  id: string;
  name: string;
  avatar?: string | null;
  lastMessage: { content: string; createdAt: string; senderName: string; senderId: string } | null;
};

export type Message = {
  id: string;
  senderName: string;
  avatar: string | null;
  text: string;
  time: string;
  isMine: boolean;
};

type Member = { userId: string; role: string; user: { id: string; fullName: string; profileImage: string | null } };
type PendingRequest = { userId: string; joinedAt: string; user: { id: string; fullName: string; profileImage: string | null } };
type Resource = { id: string; title: string; type: string; url: string; addedBy: { fullName: string }; createdAt: string };


type ProjectDetail = {
  id: string;
  ownerId: string;
  githubUrl: string | null;
  boardUrl: string | null;
  docsUrl: string | null;
  members: Member[];
};

type MemberProfile = {
  id: string;
  fullName: string;
  bio: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  profileImage: string | null;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// --- INITIALS AVATAR COMPONENT ---
function UserAvatar({
  name,
  src,
  size = "md",
  onClick
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  onClick?: () => void
}) {
  const sizeClasses = size === "sm" ? "w-7 h-7 text-[10px]" : size === "lg" ? "w-14 h-14 text-base" : "w-10 h-10 text-xs";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        onClick={onClick}
        className={`${sizeClasses} rounded-full object-cover flex-shrink-0 border border-slate-200 ${
          onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        }`}
      />
    );
  }

  const initials = name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses} rounded-full bg-slate-800 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm ${
        onClick ? "cursor-pointer hover:bg-blue-600 transition-colors" : ""
      }`}
    >
      {initials || <UserIcon size={14} />}
    </div>
  );
}

// --- MAIN MESSAGES MODULE ---
export function MessagesModule({ user }: { user: AppUser }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  // Project hub state (group conversations only)
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  // UI state
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showEditLinksModal, setShowEditLinksModal] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);

  const [githubInput, setGithubInput] = useState("");
  const [boardInput, setBoardInput] = useState("");
  const [docsInput, setDocsInput] = useState("");

  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resType, setResType] = useState<"document" | "paper" | "link">("paper");

  const bottomRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const dmTargetId = searchParams.get("dm");

  const isOwner = !!projectDetail && projectDetail.ownerId === user.id;

  // runs once conversations have loaded, handles the deep link
  useEffect(() => {
    if (!dmTargetId || loadingConvos) return;

    const existing = conversations.find((c) => c.type === "dm" && c.id === dmTargetId);
    if (existing) {
      setActiveConvo(existing);
      return;
    }

    // No existing thread — synthesize one so the user can send the first message
    usersApi.get(dmTargetId).then((res) => {
      setActiveConvo({
        type: "dm",
        id: res.user.id,
        name: res.user.fullName,
        avatar: res.user.profileImage,
        lastMessage: null,
      });
    }).catch(() => {
      setError("Could not start conversation — user not found.");
    });
    // deliberately not adding dmTargetId to deps beyond this effect's own guard —
    // this should only run once when the page loads with a ?dm= param
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingConvos, conversations]);

  const mapMessage = useCallback(
    (raw: any): Message => ({
      id: raw.id,
      senderName: raw.senderId === user.id ? "You" : raw.sender?.fullName ?? "Unknown",
      avatar: raw.sender?.profileImage ?? null,
      text: raw.content,
      time: formatTime(raw.createdAt),
      isMine: raw.senderId === user.id,
    }),
    [user.id]
  );

  const loadConversations = useCallback(async () => {
    try {
      const res = await messagesApi.listConversations();
      setConversations(res.conversations);
      setActiveConvo((prev) => prev ?? res.conversations[0] ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load conversations.");
    } finally {
      setLoadingConvos(false);
    }
  }, []);

  const loadMessages = useCallback(
    async (convo: Conversation) => {
      setLoadingMessages(true);
      try {
        const res = convo.type === "group" ? await projectsApi.listMessages(convo.id) : await messagesApi.dmThread(convo.id);
        setMessages([...res.messages].reverse().map(mapMessage));
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not load messages.");
      } finally {
        setLoadingMessages(false);
      }
    },
    [mapMessage]
  );

  const loadProjectHub = useCallback(async (projectId: string) => {
    try {
      const [projectRes, resourcesRes] = await Promise.all([
        projectsApi.get(projectId),
        projectsApi.listResources(projectId),
      ]);
      const project = projectRes.project;
      setProjectDetail(project);
      setGithubInput(project.githubUrl ?? "");
      setBoardInput(project.boardUrl ?? "");
      setDocsInput(project.docsUrl ?? "");
      setResources(resourcesRes.resources);

      if (project.ownerId === user.id) {
        const requestsRes = await projectsApi.listRequests(projectId);
        setPendingRequests(requestsRes.requests);
      } else {
        setPendingRequests([]);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load project details.");
    }
  }, [user.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConvo) return;

    loadMessages(activeConvo);
    setShowThreeDotsMenu(false);

    if (activeConvo.type === "group") {
      loadProjectHub(activeConvo.id);
    } else {
      setProjectDetail(null);
      setResources([]);
      setPendingRequests([]);
    }
  }, [activeConvo, loadMessages, loadProjectHub]);

  useEffect(() => {
    if (!activeConvo) return;
    const interval = setInterval(() => loadMessages(activeConvo), 5000);
    return () => clearInterval(interval);
  }, [activeConvo, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowThreeDotsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- MESSAGING ACTIONS ---
  const sendMessage = async () => {
    if (!input.trim() || !activeConvo) return;
    const content = input;

    setInput("");
    setShowEmojis(false);

    try {
      await messagesApi.send(
        activeConvo.type === "group" ? { projectId: activeConvo.id, content } : { recipientId: activeConvo.id, content }
      );
      await loadMessages(activeConvo);
      loadConversations();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message.");
      setInput(content);
    }
  };

  const handleSaveLinks = async () => {
    if (!activeConvo) return;
    try {
      const res = await projectsApi.updateLinks(activeConvo.id, {
        githubUrl: githubInput || null,
        boardUrl: boardInput || null,
        docsUrl: docsInput || null,
      });
      setProjectDetail((prev) => (prev ? { ...prev, ...res.links } : prev));
      setShowEditLinksModal(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save links.");
    }
  };

  const handleAddResource = async () => {
    if (!activeConvo || !resTitle.trim() || !resUrl.trim()) return;
    try {
      await projectsApi.addResource(activeConvo.id, { title: resTitle.trim(), type: resType, url: resUrl.trim() });
      setResTitle("");
      setResUrl("");
      const res = await projectsApi.listResources(activeConvo.id);
      setResources(res.resources);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add resource.");
    }
  };

  const handleRemoveResource = async (resourceId: string) => {
    if (!activeConvo) return;
    try {
      await projectsApi.removeResource(activeConvo.id, resourceId);
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove resource.");
    }
  };

  const handleAcceptRequest = async (targetUserId: string) => {
    if (!activeConvo) return;
    try {
      await projectsApi.respondToRequest(activeConvo.id, targetUserId, "ACCEPT");
      setPendingRequests((prev) => prev.filter((r) => r.userId !== targetUserId));
      loadProjectHub(activeConvo.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not accept request.");
    }
  };

  const handleRejectRequest = async (targetUserId: string) => {
    if (!activeConvo) return;
    try {
      await projectsApi.respondToRequest(activeConvo.id, targetUserId, "REJECT");
      setPendingRequests((prev) => prev.filter((r) => r.userId !== targetUserId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reject request.");
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!activeConvo || !confirm("Remove this member from the project?")) return;
    try {
      await projectsApi.removeMember(activeConvo.id, targetUserId);
      loadProjectHub(activeConvo.id);
      setSelectedMember(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove member.");
    }
  };

  const openMemberProfile = async (userId: string) => {
    try {
      const res = await usersApi.get(userId);
      setSelectedMember(res.user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load profile.");
    }
  };

  if (loadingConvos) {
    return <div className="p-6 text-slate-400 text-sm">Loading conversations...</div>;
  }

  return (
    <div className="flex h-[620px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* LEFT SIDEBAR: Conversations */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-slate-800 text-base">Conversations</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {conversations.length === 0 && <p className="p-4 text-sm text-slate-400">No conversations yet.</p>}
          {conversations.map((convo) => (
            <button
              key={`${convo.type}-${convo.id}`}
              onClick={() => setActiveConvo(convo)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                activeConvo?.id === convo.id && activeConvo?.type === convo.type
                  ? "bg-white shadow-sm border border-slate-200"
                  : "hover:bg-slate-100 border border-transparent"
              }`}
            >
              {convo.type === "group" ? (
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={18} />
                </div>
              ) : (
                <UserAvatar name={convo.name} src={convo.avatar} size="md" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-slate-800 text-sm truncate">{convo.name}</p>
                </div>
                <p className="text-slate-500 text-xs truncate">
                  {convo.lastMessage ? `${convo.lastMessage.senderName}: ${convo.lastMessage.content}` : "No messages yet"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE: Chat */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {!activeConvo ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a conversation to start chatting.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 relative">
              <div className="flex items-center gap-3">
                {activeConvo.type === "group" ? (
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                    <Users size={18} />
                  </div>
                ) : (
                  <UserAvatar name={activeConvo.name} src={activeConvo.avatar} size="md" />
                )}
                <div>
                  <p className="font-bold text-slate-800 text-sm">{activeConvo.name}</p>
                  <p className="text-blue-600 text-xs font-medium">
                    {activeConvo.type === "group" ? `${projectDetail?.members.length ?? 0} Members` : "Direct Message"}
                  </p>
                </div>
              </div>

              {activeConvo.type === "group" && (
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
                    <MoreVertical size={18} />
                  </button>
                  {showThreeDotsMenu && (
                    <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-40">
                      <button
                        onClick={() => { setShowGroupInfoModal(true); setShowThreeDotsMenu(false); }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                      >
                        <Info size={15} className="text-blue-600" />
                        Group Info & Members
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <div className="px-6 py-2 bg-red-50 text-red-600 text-xs border-b border-red-100">{error}</div>}

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {loadingMessages && <p className="text-sm text-slate-400">Loading messages...</p>}
              {!loadingMessages && messages.length === 0 && <p className="text-sm text-slate-400">No messages yet. Say hello!</p>}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}>
                  {!msg.isMine && <UserAvatar name={msg.senderName} src={msg.avatar} size="sm" />}
                  <div className={`max-w-[70%] ${msg.isMine ? "items-end" : "items-start"} flex flex-col`}>
                    {!msg.isMine && <span className="text-[11px] text-slate-500 mb-1 ml-1 font-medium">{msg.senderName}</span>}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.isMine ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-5 py-3 bg-white border-t border-slate-200 relative">
              {showEmojis && (
                <div className="absolute bottom-16 left-6 bg-white border border-slate-200 shadow-xl rounded-xl p-2 flex gap-2 z-20">
                  {["👍", "🚀", "🔥", "✅", "💡", "🎉", "❤️"].map((emoji) => (
                    <button key={emoji} onClick={() => setInput((prev) => prev + emoji)} className="text-xl hover:scale-125 transition-transform p-1">
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
                <div className="flex items-center">
                  <button disabled className="p-2 text-slate-300 rounded-lg cursor-not-allowed" title="File attachments coming soon">
                    <Paperclip size={18} />
                  </button>
                  <button disabled className="p-2 text-slate-300 rounded-lg cursor-not-allowed" title="Image uploads coming soon">
                    <ImageIcon size={18} />
                  </button>
                  <button onClick={() => setShowEmojis(!showEmojis)} className="p-2 text-slate-400 hover:text-amber-500 rounded-lg">
                    <Smile size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-sm focus:outline-none text-slate-800"
                />
                <button onClick={sendMessage} disabled={!input.trim()} className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SIDEBAR: Project Hub (group only) */}
      {activeConvo?.type === "group" && projectDetail && (
        <div className="w-72 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Project Hub</h3>
              <p className="text-[11px] text-slate-500">Links, resources & team</p>
            </div>
            {isOwner && (
              <button onClick={() => setShowEditLinksModal(true)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs flex items-center gap-1 font-semibold">
                <Edit3 size={14} /> Edit
              </button>
            )}
          </div>

          <div className="p-4 space-y-5 overflow-y-auto flex-1">
            {/* Links */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Management Links</h4>
              <div className="space-y-2">
                {projectDetail.githubUrl && (
                  <a href={projectDetail.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 group">
                    <div className="flex items-center gap-2"><Github size={16} className="text-slate-800" /><span className="text-xs font-semibold text-slate-700">GitHub Repo</span></div>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                )}
                {projectDetail.boardUrl && (
                  <a href={projectDetail.boardUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 group">
                    <div className="flex items-center gap-2"><Trello size={16} className="text-blue-600" /><span className="text-xs font-semibold text-slate-700">Task Board</span></div>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                )}
                {projectDetail.docsUrl && (
                  <a href={projectDetail.docsUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 group">
                    <div className="flex items-center gap-2"><FileText size={16} className="text-blue-500" /><span className="text-xs font-semibold text-slate-700">Docs</span></div>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                )}
                {!projectDetail.githubUrl && !projectDetail.boardUrl && !projectDetail.docsUrl && (
                  <p className="text-xs text-slate-400">No links set yet.</p>
                )}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen size={13} className="text-blue-600" /> Resources ({resources.length})
                </h4>
                <button onClick={() => setShowResourcesModal(true)} className="text-[11px] font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="space-y-1.5">
                {resources.slice(0, 3).map((res) => (
                  <a key={res.id} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 group">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{res.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">By {res.addedBy.fullName}</p>
                      </div>
                    </div>
                  </a>
                ))}
                {resources.length === 0 && (
                  <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400">No resources yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Members */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team ({projectDetail.members.length})</h4>
                {isOwner && (
                  <button onClick={() => setShowAddMemberModal(true)} className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors">
                    <UserPlus size={12} /> Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {projectDetail.members.map((m) => {
                  const memberIsOwner = m.userId === projectDetail.ownerId;
                  return (
                    <div key={m.userId} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                      <div onClick={() => openMemberProfile(m.userId)} className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <UserAvatar name={m.user.fullName} src={m.user.profileImage} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                            {m.user.fullName}
                            {memberIsOwner && <Crown size={12} className="text-amber-500" />}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{m.role}</p>
                        </div>
                      </div>
                      {isOwner && !memberIsOwner && (
                        <button onClick={() => handleRemoveMember(m.userId)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 transition-opacity" title="Remove member">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Resources repository */}
      {showResourcesModal && activeConvo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2"><FolderOpen size={20} className="text-blue-600" />Resources</h3>
              <button onClick={() => setShowResourcesModal(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            </div>

            <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><Plus size={14} className="text-blue-600" /> Add Resource</p>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="Title" value={resTitle} onChange={(e) => setResTitle(e.target.value)} className="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" />
                <select value={resType} onChange={(e) => setResType(e.target.value as any)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                  <option value="paper">Paper</option>
                  <option value="document">Document</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="URL" value={resUrl} onChange={(e) => setResUrl(e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none" />
                <button onClick={handleAddResource} disabled={!resTitle.trim() || !resUrl.trim()} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50">Add</button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {resources.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0"><FileText size={18} /></div>
                    <div className="min-w-0">
                      <a href={res.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-800 hover:text-blue-600 truncate block">{res.title}</a>
                      <p className="text-[10px] text-slate-400">Added by {res.addedBy.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a href={res.url} target="_blank" rel="noreferrer" className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"><Download size={15} /></a>
                    <button onClick={() => handleRemoveResource(res.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 mt-4 border-t border-slate-100">
              <button onClick={() => setShowResourcesModal(false)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Member profile */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X size={18} /></button>
            <div className="flex flex-col items-center text-center">
              <UserAvatar name={selectedMember.fullName} src={selectedMember.profileImage} size="lg" />
              <h3 className="font-bold text-lg text-slate-800 mt-3">{selectedMember.fullName}</h3>
              <p className="text-xs text-slate-500 mt-3">{selectedMember.bio || "No bio provided."}</p>
              <div className="w-full border-t border-slate-100 my-4 pt-3 space-y-2 text-left">
                {selectedMember.githubUrl && (
                  <a href={selectedMember.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-600">
                    <Github size={14} className="text-slate-400" /> GitHub
                  </a>
                )}
              </div>
              {isOwner && projectDetail && selectedMember.id !== projectDetail.ownerId && (
                <button onClick={() => handleRemoveMember(selectedMember.id)} className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2">
                  <Trash2 size={14} /> Remove from Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Group info */}
      {showGroupInfoModal && projectDetail && activeConvo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2"><Users size={18} className="text-blue-600" />{activeConvo.name}</h3>
              <button onClick={() => setShowGroupInfoModal(false)} className="text-slate-400 p-1"><X size={18} /></button>
            </div>
            <div className="my-4">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Members ({projectDetail.members.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {projectDetail.members.map((m) => (
                  <div key={m.userId} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-xs">
                    <span className="font-semibold text-slate-800">{m.user.fullName}</span>
                    <span className="text-slate-500 text-[11px]">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setShowGroupInfoModal(false)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Pending requests (owner only) — replaces free-text "add member" */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Pending Join Requests</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 p-1"><X size={18} /></button>
            </div>
            <div className="space-y-2 my-4 max-h-72 overflow-y-auto">
              {pendingRequests.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No pending requests.</p>}
              {pendingRequests.map((req) => (
                <div key={req.userId} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserAvatar name={req.user.fullName} src={req.user.profileImage} size="sm" />
                    <p className="text-xs font-semibold text-slate-800 truncate">{req.user.fullName}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleAcceptRequest(req.userId)} className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-semibold hover:bg-blue-700">Accept</button>
                    <button onClick={() => handleRejectRequest(req.userId)} className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold hover:bg-slate-300">Reject</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setShowAddMemberModal(false)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit links (owner only) */}
      {showEditLinksModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Edit Project Links</h3>
              <button onClick={() => setShowEditLinksModal(false)} className="text-slate-400 p-1"><X size={18} /></button>
            </div>
            <div className="space-y-3 my-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">GitHub Repo URL</label>
                <input type="text" value={githubInput} onChange={(e) => setGithubInput(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Board URL</label>
                <input type="text" value={boardInput} onChange={(e) => setBoardInput(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Docs URL</label>
                <input type="text" value={docsInput} onChange={(e) => setDocsInput(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowEditLinksModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">Cancel</button>
              <button onClick={handleSaveLinks} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}