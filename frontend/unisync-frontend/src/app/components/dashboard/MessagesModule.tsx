"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Send, Paperclip, Image, Smile, Users, MessageCircle } from "lucide-react";
import type { AppUser } from "../../UserContext";
import { messagesApi } from "@/src/lib/api/messages";
import { projectsApi } from "@/src/lib/api/projects";
import { ApiError } from "@/src/lib/api-client";

type Message = {
  id: string;
  senderName: string;
  avatar: string | null;
  text: string;
  time: string;
  isMine: boolean;
};

// type Chat = {
//   id: number;
//   name: string;
//   avatar: string;
//   isGroup: boolean;
//   lastMsg: string;
//   time: string;
//   unread: number;
//   messages: Message[];
// };

type Conversation = {
  type: "group" | "dm";
  id: string; // projectId for group, otherUserId for dm
  name: string;
  avatar?: string | null;
  lastMessage: {
    content: string;
    createdAt: string;
    senderName: string;
    senderId: string;
  } | null;
};

// const CHATS: Chat[] = [
//   {
//     id: 1,
//     name: "AI Project Group",
//     avatar: "",
//     isGroup: true,
//     lastMsg: "Priya: I've pushed the model weights",
//     time: "2m",
//     unread: 3,
//     messages: [
//       { id: 1, sender: "System", avatar: "", text: "Group created after agreement acceptance.", time: "9:00 AM", isMine: false, type: "system" },
//       { id: 2, sender: "Priya T.", avatar: "https://i.pravatar.cc/32?img=5", text: "Hey everyone! Let's kick things off 🚀", time: "9:05 AM", isMine: false },
//       { id: 3, sender: "Me", avatar: "", text: "Excited to work with you all!", time: "9:06 AM", isMine: true },
//       { id: 4, sender: "Bikash G.", avatar: "https://i.pravatar.cc/32?img=11", text: "I've set up the GitHub repo. Sharing the link now.", time: "9:10 AM", isMine: false },
//       { id: 5, sender: "Priya T.", avatar: "https://i.pravatar.cc/32?img=5", text: "I've pushed the model weights", time: "2m ago", isMine: false },
//     ],
//   },
//   {
//     id: 2,
//     name: "Priya Thapa",
//     avatar: "https://i.pravatar.cc/40?img=5",
//     isGroup: false,
//     lastMsg: "Sure, let's meet tomorrow at 10",
//     time: "1h",
//     unread: 0,
//     messages: [
//       { id: 1, sender: "Priya T.", avatar: "https://i.pravatar.cc/32?img=5", text: "Hi! Are you free to discuss the project?", time: "Yesterday", isMine: false },
//       { id: 2, sender: "Me", avatar: "", text: "Yes, what time works for you?", time: "Yesterday", isMine: true },
//       { id: 3, sender: "Priya T.", avatar: "https://i.pravatar.cc/32?img=5", text: "Sure, let's meet tomorrow at 10", time: "1h ago", isMine: false },
//     ],
//   },
//   {
//     id: 3,
//     name: "Campus Event Team",
//     avatar: "",
//     isGroup: true,
//     lastMsg: "Meeting postponed to 3 PM",
//     time: "3h",
//     unread: 1,
//     messages: [
//       { id: 1, sender: "Sita R.", avatar: "https://i.pravatar.cc/32?img=12", text: "Meeting postponed to 3 PM", time: "3h ago", isMine: false },
//     ],
//   },
// ];

// function MessageBubble({ msg }: { msg: Message }) {
//   if (msg.type === "system") {
//     return (
//       <div className="flex justify-center my-2">
//         <span className="px-3 py-1 bg-blue-50 text-blue-400 text-xs rounded-full border border-blue-100">{msg.text}</span>
//       </div>
//     );
//   }

//   return (
//     <div className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}>
//       {!msg.isMine && (
//         <img src={msg.avatar} alt={msg.sender} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
//       )}
//       <div className={`max-w-[70%] ${msg.isMine ? "items-end" : "items-start"} flex flex-col`}>
//         {!msg.isMine && (
//           <span className="text-xs text-slate-400 mb-1 ml-1">{msg.sender}</span>
//         )}
//         <div
//           className={`px-4 py-2.5 rounded-2xl text-sm select-text ${
//             msg.isMine
//               ? "bg-blue-600 text-white rounded-br-sm"
//               : "bg-white text-slate-800 border border-blue-100 rounded-bl-sm"
//           }`}
//         >
//           {msg.text}
//         </div>
//         <span className="text-xs text-slate-300 mt-1 mx-1">{msg.time}</span>
//       </div>
//     </div>
//   );
// }

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={`flex items-end gap-2 ${msg.isMine ? "flex-row-reverse" : ""}`}>
      {!msg.isMine && msg.avatar && (
        <img src={msg.avatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
      )}
      <div className={`max-w-[70%] ${msg.isMine ? "items-end" : "items-start"} flex flex-col`}>
        {!msg.isMine && <span className="text-xs text-slate-400 mb-1 ml-1">{msg.senderName}</span>}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm select-text ${
            msg.isMine
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white text-slate-800 border border-blue-100 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <span className="text-xs text-slate-300 mt-1 mx-1">{msg.time}</span>
      </div>
    </div>
  );
}

export function MessagesModule({ user }: { user: AppUser }) {
  // const [chats] = useState(CHATS);
  // const [activeChat, setActiveChat] = useState<Chat>(CHATS[0]);
  // const [input, setInput] = useState("");
  // const [messages, setMessages] = useState(CHATS[0].messages);
  // const bottomRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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
      // auto-select the first conversation if none is active yet
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
      setError("");
      try {
        const res =
          convo.type === "group"
            ? await projectsApi.listMessages(convo.id)
            : await messagesApi.dmThread(convo.id);
        // both endpoints return newest-first; reverse for natural reading order
        setMessages([...res.messages].reverse().map(mapMessage));
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Could not load messages.");
      } finally {
        setLoadingMessages(false);
      }
    },
    [mapMessage]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeConvo) loadMessages(activeConvo);
  }, [activeConvo, loadMessages]);

  // Simple polling while a conversation is open — no websocket/SSE infra
  // exists yet, so this is the pragmatic stand-in for "new messages appear."
  useEffect(() => {
    if (!activeConvo) return;
    const interval = setInterval(() => loadMessages(activeConvo), 5000);
    return () => clearInterval(interval);
  }, [activeConvo, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConvo) return;
    const content = input;
    setInput("");

    try {
      await messagesApi.send(
        activeConvo.type === "group"
          ? { projectId: activeConvo.id, content }
          : { recipientId: activeConvo.id, content }
      );
      await loadMessages(activeConvo);
      loadConversations(); // refresh sidebar previews/order
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message.");
      setInput(content); // restore so the user doesn't lose what they typed
    }
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-blue-50">
          <h3 className="font-bold text-slate-800 text-sm">Messages</h3>
        </div>
        <div className="overflow-y-auto flex-1">
          {loadingConvos && <p className="p-4 text-sm text-slate-400">Loading...</p>}
          {!loadingConvos && conversations.length === 0 && (
            <p className="p-4 text-sm text-slate-400">No conversations yet.</p>
          )}
          {conversations.map((convo) => (
            <button
              key={`${convo.type}-${convo.id}`}
              onClick={() => setActiveConvo(convo)}
              className={`w-full flex items-center gap-3 p-3 border-b border-blue-50 transition-colors text-left ${
                activeConvo?.id === convo.id && activeConvo?.type === convo.type ? "bg-blue-50" : "hover:bg-slate-50"
              }`}
            >
              {convo.type === "group" ? (
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-blue-600" />
                </div>
              ) : (
                <img
                  src={convo.avatar ?? "https://i.pravatar.cc/40"}
                  alt={convo.name}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{convo.name}</p>
                <p className="text-slate-500 text-xs truncate">
                  {convo.lastMessage
                    ? `${convo.lastMessage.senderName}: ${convo.lastMessage.content}`
                    : "No messages yet"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden flex flex-col">
        {!activeConvo ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a conversation to start chatting.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-blue-50">
              {activeConvo.type === "group" ? (
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users size={16} className="text-blue-600" />
                </div>
              ) : (
                <img
                  src={activeConvo.avatar ?? "https://i.pravatar.cc/36"}
                  alt={activeConvo.name}
                  className="w-9 h-9 rounded-xl object-cover"
                />
              )}
              <div>
                <p className="font-bold text-slate-800 text-sm">{activeConvo.name}</p>
                <p className="text-blue-400 text-xs">{activeConvo.type === "group" ? "Project Group" : "Direct Message"}</p>
              </div>
            </div>

            {error && (
              <div className="px-5 py-2 bg-red-50 text-red-600 text-xs border-b border-red-100">{error}</div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-blue-50/30">
              {loadingMessages && <p className="text-sm text-slate-400">Loading messages...</p>}
              {!loadingMessages && messages.length === 0 && (
                <p className="text-sm text-slate-400">No messages yet. Say hello!</p>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-5 py-4 border-t border-blue-50 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors" disabled>
                    <Paperclip size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors" disabled>
                    <Image size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors" disabled>
                    <Smile size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}