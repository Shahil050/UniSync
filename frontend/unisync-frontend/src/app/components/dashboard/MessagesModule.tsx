"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Users,
  Github,
  Trello,
  FileText,
  ExternalLink,
  MoreVertical,
  File,
  X,
  Edit3,
  CheckCircle,
  User as UserIcon,
  Globe,
  UserPlus,
  Trash2,
  Crown,
  BellOff,
  Bell,
  Trash,
  LogOut,
  Info,
  ShieldAlert,
  FolderOpen,
  Plus,
  Download,
  Camera,
} from "lucide-react";
import type { AppUser } from "../../App";

// --- TYPES ---
export type Message = {
  id: number;
  sender: string;
  avatar?: string;
  text: string;
  time: string;
  isMine: boolean;
  type?: "text" | "system" | "file" | "image";
  fileName?: string;
  fileUrl?: string;
};

export type ProjectMember = {
  name: string;
  avatar?: string;
  role: string;
  email?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  isPitcher?: boolean;
};

export type SharedResource = {
  id: string;
  title: string;
  type: "document" | "paper" | "link" | "image";
  url: string;
  addedBy: string;
  date: string;
};

export type ProjectInfo = {
  github: string;
  board: string;
  docs: string;
  members: ProjectMember[];
  pitcherName: string;
  resources: SharedResource[];
};

export type Chat = {
  id: number;
  name: string;
  avatar?: string;
  isGroup: boolean;
  lastMsg: string;
  time: string;
  unread: number;
  isMuted?: boolean;
  messages: Message[];
  projectInfo?: ProjectInfo;
};

// --- INITIAL MOCK DATA ---
const INITIAL_CHATS: Chat[] = [
  {
    id: 1,
    name: "AI Crop Disease Research",
    isGroup: true,
    lastMsg: "Priya: I've updated the model weights",
    time: "2m",
    unread: 2,
    isMuted: false,
    projectInfo: {
      pitcherName: "Priya Thapa",
      github: "https://github.com",
      board: "https://jira.atlassian.com",
      docs: "https://docs.google.com",
      resources: [
        {
          id: "1",
          title: "Crop Disease Dataset & Model Weights Paper.pdf",
          type: "paper",
          url: "https://arxiv.org",
          addedBy: "Priya Thapa",
          date: "Yesterday",
        },
        {
          id: "2",
          title: "System Architecture & API Specs",
          type: "document",
          url: "https://docs.google.com",
          addedBy: "Bikash Gurung",
          date: "3 days ago",
        },
      ],
      members: [
        {
          name: "Priya Thapa",
          role: "Team Lead & Idea Pitcher",
          email: "priya.t@pu.edu.np",
          bio: "7th Sem Computer Engineering. Pitcher of AI Crop Disease project.",
          github: "github.com/priyathapa",
          linkedin: "linkedin.com/in/priyathapa",
          isPitcher: true,
        },
        {
          name: "Bikash Gurung",
          role: "Backend Dev",
          email: "bikash.g@pu.edu.np",
          bio: "Fullstack NodeJS & Python Developer.",
          github: "github.com/bikashg",
        },
        {
          name: "Aarav Sharma (You)",
          role: "Frontend Dev",
          email: "aarav.sharma@pu.edu.np",
          bio: "React & UI/UX Designer.",
          github: "github.com/aaravsharma",
        },
      ],
    },
    messages: [
      {
        id: 1,
        sender: "System",
        text: "Group automatically formed! Collaboration criteria met.",
        time: "9:00 AM",
        isMine: false,
        type: "system",
      },
      {
        id: 2,
        sender: "Priya Thapa",
        text: "Welcome everyone! Let me know if you can access the GitHub repo from the sidebar.",
        time: "9:05 AM",
        isMine: false,
      },
      {
        id: 3,
        sender: "Aarav Sharma",
        text: "Got it! Starting work on the UI components today.",
        time: "9:06 AM",
        isMine: true,
      },
      {
        id: 4,
        sender: "Bikash Gurung",
        text: "API endpoints are ready on the staging server.",
        time: "9:10 AM",
        isMine: false,
      },
    ],
  },
  {
    id: 2,
    name: "Priya Thapa",
    isGroup: false,
    lastMsg: "Sure, let's meet tomorrow at 10 AM",
    time: "1h",
    unread: 0,
    isMuted: false,
    messages: [
      {
        id: 1,
        sender: "Priya Thapa",
        text: "Hi Aarav, did you review the project proposal?",
        time: "Yesterday",
        isMine: false,
      },
      {
        id: 2,
        sender: "Aarav Sharma",
        text: "Yes, looks solid! Should we schedule a quick call?",
        time: "Yesterday",
        isMine: true,
      },
    ],
  },
];

// --- INITIALS AVATAR COMPONENT ---
function UserAvatar({
  name,
  src,
  size = "md",
  onClick,
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) {
  if (src) {
    const sizeClasses =
      size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
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
    .replace("(You)", "")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses =
    size === "sm"
      ? "w-7 h-7 text-[10px]"
      : size === "lg"
      ? "w-14 h-14 text-base"
      : "w-10 h-10 text-xs";

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
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<number>(INITIAL_CHATS[0].id);
  const [input, setInput] = useState("");

  // Menu & Modal States
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);
  const [showEditLinksModal, setShowEditLinksModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  // Group Details Edit State
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupAvatar, setEditGroupAvatar] = useState("");

  // Forms State
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Resource Form State
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resType, setResType] = useState<"document" | "paper" | "link">("paper");

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const [githubInput, setGithubInput] = useState(activeChat.projectInfo?.github || "");
  const [boardInput, setBoardInput] = useState(activeChat.projectInfo?.board || "");
  const [docsInput, setDocsInput] = useState(activeChat.projectInfo?.docs || "");

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const groupAvatarInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentUserFullName = user.name || "Aarav Sharma (You)";
  const isCurrentUserPitcher =
    activeChat.projectInfo?.pitcherName === currentUserFullName ||
    activeChat.projectInfo?.pitcherName === "Aarav Sharma";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages]);

  useEffect(() => {
    if (activeChat.projectInfo) {
      setGithubInput(activeChat.projectInfo.github);
      setBoardInput(activeChat.projectInfo.board);
      setDocsInput(activeChat.projectInfo.docs);
    }
    setShowThreeDotsMenu(false);
  }, [activeChatId]);

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
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: currentUserFullName,
      avatar: user.avatarUrl || user.avatar,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
      type: "text",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMsg: `You: ${input.trim()}`,
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
    setInput("");
    setShowEmojis(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    const newMsg: Message = {
      id: Date.now(),
      sender: currentUserFullName,
      avatar: user.avatarUrl || user.avatar,
      text: isImage ? "Shared an image" : `Shared file: ${file.name}`,
      fileName: file.name,
      fileUrl: fileUrl,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
      type: isImage ? "image" : "file",
    };

    const newResource: SharedResource = {
      id: String(Date.now()),
      title: file.name,
      type: isImage ? "image" : "document",
      url: fileUrl,
      addedBy: currentUserFullName,
      date: "Just now",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMsg: `You attached ${file.name}`,
              messages: [...c.messages, newMsg],
              projectInfo: c.projectInfo
                ? {
                    ...c.projectInfo,
                    resources: [newResource, ...(c.projectInfo.resources || [])],
                  }
                : undefined,
            }
          : c
      )
    );
    e.target.value = "";
  };

  // --- GROUP DETAILS MANAGEMENT ---
  const handleGroupAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditGroupAvatar(url);
    }
  };

  const handleSaveGroupDetails = () => {
    if (!editGroupName.trim()) return;

    const systemMsg: Message = {
      id: Date.now(),
      sender: "System",
      text: `${currentUserFullName} updated the group details.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMine: false,
      type: "system",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              name: editGroupName.trim(),
              avatar: editGroupAvatar,
              messages: [...c.messages, systemMsg],
            }
          : c
      )
    );

    setShowEditGroupModal(false);
  };

  // --- RESOURCE MANAGEMENT ---
  const handleAddResource = () => {
    if (!resTitle.trim() || !resUrl.trim()) return;

    const newResource: SharedResource = {
      id: String(Date.now()),
      title: resTitle.trim(),
      type: resType,
      url: resUrl.trim().startsWith("http") ? resUrl.trim() : `https://${resUrl.trim()}`,
      addedBy: currentUserFullName,
      date: "Just now",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId && c.projectInfo
          ? {
              ...c,
              projectInfo: {
                ...c.projectInfo,
                resources: [newResource, ...(c.projectInfo.resources || [])],
              },
            }
          : c
      )
    );

    setResTitle("");
    setResUrl("");
  };

  const handleRemoveResource = (id: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId && c.projectInfo
          ? {
              ...c,
              projectInfo: {
                ...c.projectInfo,
                resources: c.projectInfo.resources.filter((r) => r.id !== id),
              },
            }
          : c
      )
    );
  };

  // --- THREE-DOT MENU ACTIONS ---
  const handleToggleMute = () => {
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, isMuted: !c.isMuted } : c))
    );
    setShowThreeDotsMenu(false);
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear this chat history?")) {
      const resetMsg: Message = {
        id: Date.now(),
        sender: "System",
        text: "Chat history cleared.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMine: false,
        type: "system",
      };

      setChats((prev) =>
        prev.map((c) => (c.id === activeChatId ? { ...c, messages: [resetMsg], lastMsg: "Chat cleared" } : c))
      );
    }
    setShowThreeDotsMenu(false);
  };

  const handleLeaveGroup = () => {
    if (!activeChat.isGroup) return;

    if (confirm(`Are you sure you want to exit '${activeChat.name}'?`)) {
      const exitMsg: Message = {
        id: Date.now(),
        sender: "System",
        text: `${currentUserFullName} left the project group.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMine: false,
        type: "system",
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId && c.projectInfo
            ? {
                ...c,
                messages: [...c.messages, exitMsg],
                projectInfo: {
                  ...c.projectInfo,
                  members: c.projectInfo.members.filter((m) => !m.name.includes("(You)")),
                },
              }
            : c
        )
      );
    }
    setShowThreeDotsMenu(false);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;

    const newMember: ProjectMember = {
      name: newMemberName.trim(),
      role: newMemberRole.trim() || "Collaborator",
      email:
        newMemberEmail.trim() ||
        `${newMemberName.toLowerCase().replace(/\s+/g, ".")}@pu.edu.np`,
      bio: "Newly added project member.",
    };

    const systemMsg: Message = {
      id: Date.now(),
      sender: "System",
      text: `${currentUserFullName} added ${newMember.name} (${newMember.role}) to the project team.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMine: false,
      type: "system",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId && c.projectInfo
          ? {
              ...c,
              messages: [...c.messages, systemMsg],
              projectInfo: {
                ...c.projectInfo,
                members: [...c.projectInfo.members, newMember],
              },
            }
          : c
      )
    );

    setNewMemberName("");
    setNewMemberRole("");
    setNewMemberEmail("");
    setShowAddMemberModal(false);
  };

  const handleRemoveMember = (memberName: string) => {
    if (!isCurrentUserPitcher) {
      alert("Permission Denied: Only the Main Idea Pitcher can remove team members!");
      return;
    }

    if (confirm(`Remove ${memberName} from this project?`)) {
      const systemMsg: Message = {
        id: Date.now(),
        sender: "System",
        text: `${currentUserFullName} removed ${memberName} from the project team.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMine: false,
        type: "system",
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId && c.projectInfo
            ? {
                ...c,
                messages: [...c.messages, systemMsg],
                projectInfo: {
                  ...c.projectInfo,
                  members: c.projectInfo.members.filter((m) => m.name !== memberName),
                },
              }
            : c
        )
      );

      setSelectedMember(null);
    }
  };

  const handleSaveLinks = () => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId && c.projectInfo
          ? {
              ...c,
              projectInfo: {
                ...c.projectInfo,
                github: githubInput,
                board: boardInput,
                docs: docsInput,
              },
            }
          : c
      )
    );
    setShowEditLinksModal(false);
  };

  return (
    <div className="flex h-[620px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* 1. LEFT SIDEBAR */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-base">Conversations</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setShowEmojis(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                activeChatId === chat.id
                  ? "bg-white shadow-sm border border-slate-200"
                  : "hover:bg-slate-100 border border-transparent"
              }`}
            >
              {chat.avatar ? (
                <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : chat.isGroup ? (
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  <Users size={18} />
                </div>
              ) : (
                <UserAvatar name={chat.name} src={chat.avatar} size="md" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-slate-800 text-sm truncate flex items-center gap-1">
                    {chat.name}
                    {chat.isMuted && <BellOff size={11} className="text-slate-400" />}
                  </p>
                  <span className="text-slate-400 text-[10px] flex-shrink-0">{chat.time}</span>
                </div>
                <p className="text-slate-500 text-xs truncate">{chat.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE PANEL */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 relative">
          <div className="flex items-center gap-3">
            {activeChat.avatar ? (
              <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
            ) : activeChat.isGroup ? (
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                <Users size={18} />
              </div>
            ) : (
              <UserAvatar name={activeChat.name} src={activeChat.avatar} size="md" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-800 text-sm">{activeChat.name}</p>
                {activeChat.isMuted && (
                  <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <BellOff size={10} /> Muted
                  </span>
                )}
              </div>
              <p className="text-blue-600 text-xs font-medium">
                {activeChat.isGroup
                  ? `${activeChat.projectInfo?.members.length} Members • Active Project`
                  : "Online"}
              </p>
            </div>
          </div>

          {/* THREE-DOT MENU */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="More options"
            >
              <MoreVertical size={18} />
            </button>

            {showThreeDotsMenu && (
              <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {activeChat.isGroup && (
                  <>
                    <button
                      onClick={() => {
                        setEditGroupName(activeChat.name);
                        setEditGroupAvatar(activeChat.avatar || "");
                        setShowEditGroupModal(true);
                        setShowThreeDotsMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                    >
                      <Edit3 size={15} className="text-blue-600" />
                      Edit Group Name & Icon
                    </button>

                    <button
                      onClick={() => {
                        setShowGroupInfoModal(true);
                        setShowThreeDotsMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                    >
                      <Info size={15} className="text-blue-600" />
                      Group Info & Members
                    </button>
                  </>
                )}

                <button
                  onClick={handleToggleMute}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                >
                  {activeChat.isMuted ? (
                    <>
                      <Bell size={15} className="text-green-600" /> Unmute Notifications
                    </>
                  ) : (
                    <>
                      <BellOff size={15} className="text-amber-600" /> Mute Notifications
                    </>
                  )}
                </button>

                <button
                  onClick={handleClearChat}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                >
                  <Trash size={15} className="text-slate-500" />
                  Clear Chat History
                </button>

                {activeChat.isGroup && (
                  <div className="border-t border-slate-100 my-1 pt-1">
                    <button
                      onClick={handleLeaveGroup}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-bold"
                    >
                      <LogOut size={15} className="text-red-600" />
                      Exit Group
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {activeChat.messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 shadow-sm flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-blue-600" />
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}
              >
                {!msg.isMine && (
                  <UserAvatar
                    name={msg.sender}
                    src={msg.avatar}
                    size="sm"
                    onClick={() =>
                      setSelectedMember({
                        name: msg.sender,
                        role: "Project Member",
                        email: `${msg.sender.toLowerCase().replace(" ", ".")}@pu.edu.np`,
                        bio: "Active project team member.",
                      })
                    }
                  />
                )}
                <div className={`max-w-[70%] ${msg.isMine ? "items-end" : "items-start"} flex flex-col`}>
                  {!msg.isMine && (
                    <span className="text-[11px] text-slate-500 mb-1 ml-1 font-medium">
                      {msg.sender}
                    </span>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.isMine
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.type === "file" && (
                      <div className="flex items-center gap-2">
                        <File size={18} className={msg.isMine ? "text-blue-200" : "text-blue-600"} />
                        <a href={msg.fileUrl || "#"} download={msg.fileName} className="font-semibold underline text-xs">
                          {msg.fileName}
                        </a>
                      </div>
                    )}

                    {msg.type === "image" && (
                      <div className="space-y-1">
                        <img src={msg.fileUrl} alt="Attachment" className="max-w-xs max-h-48 rounded-lg object-cover border" />
                        <p className="text-xs italic">{msg.fileName}</p>
                      </div>
                    )}

                    {(!msg.type || msg.type === "text") && msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 relative">
          {showEmojis && (
            <div className="absolute bottom-16 left-6 bg-white border border-slate-200 shadow-xl rounded-xl p-2 flex gap-2 z-20">
              {["👍", "🚀", "🔥", "✅", "💡", "🎉", "❤️"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setInput((prev) => prev + emoji)}
                  className="text-xl hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
            <div className="flex items-center">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                <Paperclip size={18} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, false)} />

              <button onClick={() => imageInputRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                <ImageIcon size={18} />
              </button>
              <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={(e) => handleFileUpload(e, true)} />

              <button onClick={() => setShowEmojis(!showEmojis)} className="p-2 text-slate-400 hover:text-amber-500 rounded-lg">
                <Smile size={18} />
              </button>
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2 py-1.5 text-sm focus:outline-none text-slate-800"
            />

            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR: GROUP PROJECT HUB */}
      {activeChat.isGroup && activeChat.projectInfo && (
        <div className="w-72 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Project Track Hub</h3>
              <p className="text-[11px] text-slate-500">Live project management</p>
            </div>
            <button
              onClick={() => setShowEditLinksModal(true)}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-xs flex items-center gap-1 font-semibold"
            >
              <Edit3 size={14} /> Edit
            </button>
          </div>

          <div className="p-4 space-y-5 overflow-y-auto flex-1">
            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Management Links
              </h4>
              <div className="space-y-2">
                <a href={activeChat.projectInfo.github} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 group">
                  <div className="flex items-center gap-2">
                    <Github size={16} className="text-slate-800 group-hover:text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">GitHub Repo</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600" />
                </a>

                <a href={activeChat.projectInfo.board} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 group">
                  <div className="flex items-center gap-2">
                    <Trello size={16} className="text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">Task Board (Jira)</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600" />
                </a>

                <a href={activeChat.projectInfo.docs} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 group">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">Docs & Paper</span>
                  </div>
                  <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600" />
                </a>
              </div>
            </div>

            {/* Papers & Documents Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderOpen size={13} className="text-blue-600" />
                  Papers & Documents ({activeChat.projectInfo.resources?.length || 0})
                </h4>
                <button
                  onClick={() => setShowResourcesModal(true)}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-1.5">
                {(activeChat.projectInfo.resources || []).slice(0, 3).map((res) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 truncate">
                          {res.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">By {res.addedBy}</p>
                      </div>
                    </div>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 flex-shrink-0 ml-1" />
                  </a>
                ))}

                {(!activeChat.projectInfo.resources || activeChat.projectInfo.resources.length === 0) && (
                  <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400">No documents uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Team Members List */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Accepted Team ({activeChat.projectInfo.members.length})
                </h4>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
                >
                  <UserPlus size={12} />
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {activeChat.projectInfo.members.map((member, idx) => {
                  const isPitcher = member.name === activeChat.projectInfo?.pitcherName || member.isPitcher;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                    >
                      <div
                        onClick={() => setSelectedMember(member)}
                        className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                      >
                        <UserAvatar name={member.name} src={member.avatar} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate flex items-center gap-1">
                            {member.name}
                            {isPitcher && (
                              <Crown size={12} className="text-amber-500" title="Idea Pitcher (Owner)" />
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                        </div>
                      </div>

                      {isCurrentUserPitcher && !isPitcher && (
                        <button
                          onClick={() => handleRemoveMember(member.name)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 transition-opacity"
                          title="Remove member (Idea Pitcher Only)"
                        >
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

      {/* --- MODAL: EDIT GROUP NAME & IMAGE --- */}
      {showEditGroupModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Edit3 size={18} className="text-blue-600" />
                Edit Group Details
              </h3>
              <button onClick={() => setShowEditGroupModal(false)} className="text-slate-400 p-1 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 my-4">
              {/* Group Avatar Preview & File Selector */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => groupAvatarInputRef.current?.click()}
                >
                  {editGroupAvatar ? (
                    <img
                      src={editGroupAvatar}
                      alt="Group Icon"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl border-2 border-blue-200">
                      <Users size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={20} />
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={groupAvatarInputRef}
                  className="hidden"
                  onChange={handleGroupAvatarUpload}
                />

                <button
                  onClick={() => groupAvatarInputRef.current?.click()}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Change Group Photo
                </button>
              </div>

              {/* Group Name Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Group Name *</label>
                <input
                  type="text"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowEditGroupModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGroupDetails}
                disabled={!editGroupName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ALL PAPERS & DOCUMENTS REPOSITORY --- */}
      {showResourcesModal && activeChat.projectInfo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <FolderOpen size={20} className="text-blue-600" />
                Project Papers & Shared Documents
              </h3>
              <button onClick={() => setShowResourcesModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            {/* Add Resource Section */}
            <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Plus size={14} className="text-blue-600" /> Add New Paper or Document Link
              </p>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Document Title (e.g. IEEE Research Paper)"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="col-span-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value as "document" | "paper" | "link")}
                  className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value="paper">Research Paper</option>
                  <option value="document">Document</option>
                  <option value="link">External Link</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="URL / Drive Link (https://...)"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
                <button
                  onClick={handleAddResource}
                  disabled={!resTitle.trim() || !resUrl.trim()}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Document
                </button>
              </div>
            </div>

            {/* List of Documents */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(activeChat.projectInfo.resources || []).map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 truncate block"
                      >
                        {res.title}
                      </a>
                      <p className="text-[10px] text-slate-400">
                        Added by {res.addedBy} • {res.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                      title="Open Link"
                    >
                      <Download size={15} />
                    </a>
                    <button
                      onClick={() => handleRemoveResource(res.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete document"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 mt-4 border-t border-slate-100">
              <button
                onClick={() => setShowResourcesModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: MEMBER PROFILE & REMOVE MODAL --- */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <UserAvatar name={selectedMember.name} src={selectedMember.avatar} size="lg" />
              <h3 className="font-bold text-lg text-slate-800 mt-3 flex items-center gap-1.5">
                {selectedMember.name}
                {(selectedMember.isPitcher || selectedMember.name === activeChat.projectInfo?.pitcherName) && (
                  <Crown size={16} className="text-amber-500" title="Main Idea Pitcher" />
                )}
              </h3>
              <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mt-1">
                {selectedMember.role}
              </p>
              <p className="text-xs text-slate-500 mt-3">{selectedMember.bio || "No bio provided."}</p>

              <div className="w-full border-t border-slate-100 my-4 pt-3 space-y-2 text-left">
                {selectedMember.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Globe size={14} className="text-slate-400" />
                    <span>{selectedMember.email}</span>
                  </div>
                )}
                {selectedMember.github && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Github size={14} className="text-slate-400" />
                    <span className="text-blue-600">{selectedMember.github}</span>
                  </div>
                )}
              </div>

              {!(selectedMember.isPitcher || selectedMember.name === activeChat.projectInfo?.pitcherName) && (
                <>
                  {isCurrentUserPitcher ? (
                    <button
                      onClick={() => handleRemoveMember(selectedMember.name)}
                      className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Trash2 size={14} />
                      Remove from Project Team
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 mt-2">
                      <ShieldAlert size={14} className="text-amber-500" />
                      Only Main Idea Pitcher ({activeChat.projectInfo?.pitcherName}) can remove members.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: GROUP INFO MODAL --- */}
      {showGroupInfoModal && activeChat.projectInfo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                {activeChat.name}
              </h3>
              <button onClick={() => setShowGroupInfoModal(false)} className="text-slate-400 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="my-4 space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Main Idea Pitcher</p>
                  <p className="text-sm font-bold text-blue-900 flex items-center gap-1">
                    <Crown size={14} className="text-amber-500" />
                    {activeChat.projectInfo.pitcherName}
                  </p>
                </div>
                <span className="text-xs bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full">Owner</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Team Members ({activeChat.projectInfo.members.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {activeChat.projectInfo.members.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-xs">
                      <span className="font-semibold text-slate-800">{m.name}</span>
                      <span className="text-slate-500 text-[11px]">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowGroupInfoModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD NEW MEMBER MODAL --- */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Add Team Member</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Suman Karki"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Role / Specialization</label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. ML Researcher"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">University Email</label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="suman.k@pu.edu.np"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!newMemberName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT LINKS MODAL --- */}
      {showEditLinksModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Edit Project Hub Links</h3>
              <button onClick={() => setShowEditLinksModal(false)} className="text-slate-400 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 my-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">GitHub Repo URL</label>
                <input
                  type="text"
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jira/Trello URL</label>
                <input
                  type="text"
                  value={boardInput}
                  onChange={(e) => setBoardInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Documentation URL</label>
                <input
                  type="text"
                  value={docsInput}
                  onChange={(e) => setDocsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowEditLinksModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLinks}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}