"use client";

import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { MessagesModule } from "../components/dashboard/MessagesModule";
import { useUser } from "../UserContext";

export function MessagesPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex flex-col">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-10 px-6 shrink-0">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <MessageCircle size={28} className="text-blue-200" />
            <div>
              <h1 className="text-3xl font-black">Messages & Collaboration</h1>
              <p className="text-blue-200 text-sm mt-1">Chat with peers and manage your project workspace.</p>
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