"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Users,
  MessageCircle,
  Github,
  Trello,
  FileText,
  ExternalLink,
  MoreVertical,
  File,
  User as UserIcon,
} from "lucide-react";
import type { AppUser } from "../../App";

// --- TYPES ---
type Message = {
  id: number;
  sender: string;
  avatar?: string;
  text: string;
  time: string;
  isMine: boolean;
  type?: "text" | "system" | "file";
  fileName?: string;
};

type ProjectInfo = {
  github: string;
  board: string;
  docs: string;
  members: { name: string; avatar?: string; role: string }[];
};

type Chat = {
  id: number;
  name: string;
  avatar?: string;
  isGroup: boolean;
  lastMsg: string;
  time: string;
  unread: number;
  messages: Message[];
  projectInfo?: ProjectInfo;
};

// --- MOCK DATA (Cleaned of fake image URLs) ---
const CHATS: Chat[] = [
  {
    id: 1,
    name: "AI Project Group",
    isGroup: true,
    lastMsg: "Priya: I've pushed the model weights",
    time: "2m",
    unread: 3,
    projectInfo: {
      github: "https://github.com/your-repo/ai-crop-model",
      board: "https://jira.com/ai-crop-tasks",
      docs: "https://docs.google.com/document/d/...",
      members: [
        { name: "Priya Thapa", role: "Team Lead" },
        { name: "Bikash Gurung", role: "Developer" },
        { name: "Aarav Sharma (You)", role: "Researcher" },
      ],
    },
    messages: [
      { id: 1, sender: "System", text: "Collaboration group created! Members reached requirement (3/4).", time: "9:00 AM", isMine: false, type: "system" },
      { id: 2, sender: "Priya Thapa", text: "Hey everyone! Let's kick things off 🚀", time: "9:05 AM", isMine: false },
      { id: 3, sender: "Aarav Sharma", text: "Excited to work with you all!", time: "9:06 AM", isMine: true },
      { id: 4, sender: "Bikash Gurung", text: "I've set up the GitHub repo. Check the sidebar for the link.", time: "9:10 AM", isMine: false },
    ],
  },
  {
    id: 2,
    name: "Priya Thapa",
    isGroup: false,
    lastMsg: "Sure, let's meet tomorrow at 10",
    time: "1h",
    unread: 0,
    messages: [
      { id: 1, sender: "Priya Thapa", text: "Hi! Are you free to discuss the project?", time: "Yesterday", isMine: false },
      { id: 2, sender: "Aarav Sharma", text: "Yes, what time works for you?", time: "Yesterday", isMine: true },
      { id: 3, sender: "Priya Thapa", text: "Sure, let's meet tomorrow at 10", time: "1h ago", isMine: false },
    ],
  },
];

// --- HELPER COMPONENT: CLEAN AVATAR FALLBACK ---
function UserAvatar({ name, src, size = "md", onClick }: { name: string; src?: string; size?: "sm" | "md" | "lg"; onClick?: () => void }) {
  if (src) {
    const sizeClasses = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
    return (
      <img
        src={src}
        alt={name}
        onClick={onClick}
        className={`${sizeClasses} rounded-full object-cover flex-shrink-0 border border-slate-200 ${onClick ? "cursor-pointer hover:opacity-80" : ""}`}
      />
    );
  }

  // Get Initials from Name (e.g., "Priya Thapa" -> "PT")
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses =
    size === "sm"
      ? "w-7 h-7 text-[10px]"
      : size === "lg"
      ? "w-12 h-12 text-sm"
      : "w-10 h-10 text-xs";

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses} rounded-full bg-slate-800 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm ${
        onClick ? "cursor-pointer hover:bg-slate-700" : ""
      }`}
    >
      {initials || <UserIcon size={14} />}
    </div>
  );
}

// --- MESSAGE BUBBLE COMPONENT ---
function MessageBubble({ msg, onViewProfile }: { msg: Message; onViewProfile: (name: string) => void }) {
  if (msg.type === "system") {
    return (
      <div className="flex justify-center my-4">
        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
          {msg.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}>
      {!msg.isMine && (
        <UserAvatar
          name={msg.sender}
          src={msg.avatar}
          size="sm"
          onClick={() => onViewProfile(msg.sender)}
        />
      )}
      <div className={`max-w-[70%] ${msg.isMine ? "items-end" : "items-start"} flex flex-col`}>
        {!msg.isMine && <span className="text-xs text-slate-500 mb-1 ml-1 font-medium">{msg.sender}</span>}
        
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm select-text shadow-sm ${
            msg.isMine
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
          }`}
        >
          {msg.type === "file" ? (
            <div className="flex items-center gap-2">
              <File size={16} className={msg.isMine ? "text-blue-200" : "text-blue-500"} />
              <span className="font-medium underline cursor-pointer">{msg.fileName}</span>
            </div>
          ) : (
            msg.text
          )}
        </div>
        <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.time}</span>
      </div>
    </div>
  );
}

// --- MAIN MESSAGES MODULE ---
export function MessagesModule({ user }: { user: AppUser }) {
  const [chats] = useState(CHATS);
  const [activeChat, setActiveChat] = useState<Chat>(CHATS[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(CHATS[0].messages);
  
  const [showEmojis, setShowEmojis] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const selectChat = (chat: Chat) => {
    setActiveChat(chat);
    setMessages(chat.messages);
    setShowEmojis(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleViewProfile = (name: string) => {
    alert(`Opening profile details for ${name}...`);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      sender: user.name,
      avatar: user.avatarUrl || user.avatar,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      type: "text"
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setShowEmojis(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: user.name,
      avatar: user.avatarUrl || user.avatar,
      text: "",
      fileName: file.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      type: "file"
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="flex h-[650px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* LEFT SIDEBAR: Chat List */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-5 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-slate-800 text-lg">Messages</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                activeChat.id === chat.id ? "bg-white shadow-sm border border-slate-200" : "hover:bg-slate-100 border border-transparent"
              }`}
            >
              {chat.isGroup ? (
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={18} />
                </div>
              ) : (
                <UserAvatar name={chat.name} src={chat.avatar} size="md" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-slate-800 text-sm truncate">{chat.name}</p>
                  <span className="text-slate-400 text-xs flex-shrink-0">{chat.time}</span>
                </div>
                <p className="text-slate-500 text-xs truncate">{chat.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE PANEL: Chat Box */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            {activeChat.isGroup ? (
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                <Users size={18} />
              </div>
            ) : (
              <UserAvatar name={activeChat.name} src={activeChat.avatar} size="md" onClick={() => handleViewProfile(activeChat.name)} />
            )}
            <div>
              <p className="font-bold text-slate-800 text-base cursor-pointer hover:underline" onClick={() => handleViewProfile(activeChat.name)}>
                {activeChat.name}
              </p>
              <p className="text-blue-600 text-xs font-medium">
                {activeChat.isGroup ? `${activeChat.projectInfo?.members.length} Active Members` : "Online"}
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-2"><MoreVertical size={20} /></button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onViewProfile={handleViewProfile} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 relative">
          {showEmojis && (
            <div className="absolute bottom-20 left-6 bg-white border border-slate-200 shadow-xl rounded-xl p-3 flex gap-2 z-10">
              {["👍", "❤️", "😂", "🚀", "🔥", "✅", "🎉"].map((emoji) => (
                <button key={emoji} onClick={() => addEmoji(emoji)} className="text-xl hover:scale-110 transition-transform">
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
            <div className="flex gap-1 pl-2">
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50" title="Attach Document">
                <Paperclip size={18} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              
              <button onClick={() => imageInputRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50" title="Upload Image">
                <ImageIcon size={18} />
              </button>
              <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={handleFileUpload} />

              <button onClick={() => setShowEmojis(!showEmojis)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors rounded-full hover:bg-amber-50" title="Add Emoji">
                <Smile size={18} />
              </button>
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none text-slate-700"
            />
            
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Collaboration Resources */}
      {activeChat.isGroup && activeChat.projectInfo && (
        <div className="w-72 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">Project Hub</h3>
            <p className="text-xs text-slate-500">Quick collaboration tools</p>
          </div>
          
          <div className="p-5 space-y-6 overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resources</h4>
              <div className="space-y-2">
                <a href={activeChat.projectInfo.github} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <Github size={16} className="text-slate-700 group-hover:text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">GitHub Repo</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                </a>
                
                <a href={activeChat.projectInfo.board} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <Trello size={16} className="text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Task Board</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                </a>

                <a href={activeChat.projectInfo.docs} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Project Docs</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Group Members</h4>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {activeChat.projectInfo.members.length}/4
                </span>
              </div>
              <div className="space-y-3">
                {activeChat.projectInfo.members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleViewProfile(member.name)}>
                    <UserAvatar name={member.name} src={member.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE CONTAINER ---
export function MessagesPage({ user }: { user: AppUser }) {
  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex flex-col">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-10 px-6 shrink-0">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <MessageCircle size={28} className="text-blue-200" />
            <div>
              <h1 className="text-3xl font-black">Messages & Collaboration</h1>
              <p className="text-blue-200 text-sm mt-1">Chat with peers, access project boards, and manage group tasks.</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 py-8 flex-1">
        <MessagesModule user={user} />
      </div>
    </div>
  );
}