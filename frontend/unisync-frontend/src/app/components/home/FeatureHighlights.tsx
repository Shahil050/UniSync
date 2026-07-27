"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import {
  Users, Lightbulb, FileSignature, MessageSquare, BarChart2,
  Award, Linkedin, Search, Bell, Gamepad2
} from "lucide-react";

const FEATURES = [
  { icon: <Users size={22} />, title: "Peer Discovery", desc: "Find peers with matching interests using AI-powered recommendations.", color: "blue" },
  { icon: <Lightbulb size={22} />, title: "Posted Ideas Feed", desc: "Browse and interact with project/research ideas posted by students.", color: "cyan" },
  { icon: <FileSignature size={22} />, title: "Agreements & Contracts", desc: "Digital collaboration contracts with roles, deadlines, and acceptance workflow.", color: "blue" },
  { icon: <MessageSquare size={22} />, title: "Messaging & Groups", desc: "Real-time group and private chat with file, photo, and video sharing.", color: "sky" },
  { icon: <BarChart2 size={22} />, title: "Activity Logs", desc: "Visual timeline of contributions, badges, and project history.", color: "blue" },
  { icon: <Award size={22} />, title: "Badges & Credentials", desc: "Earn verified badges for completed projects. Export for portfolio.", color: "cyan" },
  { icon: <Linkedin size={22} />, title: "LinkedIn / GitHub Integration", desc: "Link professional profiles to build trust and credibility.", color: "blue" },
  { icon: <Search size={22} />, title: "Search & Filters", desc: "Global search by name, skill, interest, or project with smart filters.", color: "sky" },
  { icon: <Bell size={22} />, title: "Notifications", desc: "Real-time alerts for requests, agreement updates, and peer matches.", color: "blue" },
  { icon: <Gamepad2 size={22} />, title: "Gamification", desc: "Leaderboards, streak counters, and contribution badges to keep you motivated.", color: "cyan" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:border-cyan-400",
  sky: "bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400",
};

const iconBgMap: Record<string, string> = {
  blue: "bg-blue-600",
  cyan: "bg-cyan-600",
  sky: "bg-sky-600",
};

function FeatureCard({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 5) * 0.08 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl border p-5 transition-all cursor-default ${colorMap[feat.color]}`}
    >
      <div className={`w-10 h-10 rounded-xl ${iconBgMap[feat.color]} text-white flex items-center justify-center mb-4 shadow-sm`}>
        {feat.icon}
      </div>
      <h3 className="font-bold text-slate-800 mb-2">{feat.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
    </motion.div>
  );
}

export function FeatureHighlights() {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true });

  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Everything You Need to Collaborate
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            UniSync brings together all the tools students need to discover peers, manage projects, and build a verified academic portfolio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feat={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}