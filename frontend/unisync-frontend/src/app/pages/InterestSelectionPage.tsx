"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Check, Plus, ArrowRight, Sparkles } from "lucide-react";
import { Footer } from "../components/Footer";

const INTEREST_CATEGORIES = [
  {
    category: "Artificial Intelligence",
    color: "blue",
    items: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Reinforcement Learning"],
  },
  {
    category: "Software Engineering",
    color: "sky",
    items: ["Web Development", "Mobile Apps", "DevOps", "System Design", "API Development"],
  },
  {
    category: "Computer Networks",
    color: "blue",
    items: ["Network Security", "Protocols", "Distributed Systems", "Cloud Computing", "IoT"],
  },
  {
    category: "Cybersecurity",
    color: "cyan",
    items: ["Ethical Hacking", "Cryptography", "Malware Analysis", "Penetration Testing", "Forensics"],
  },
  {
    category: "Data Science",
    color: "blue",
    items: ["Data Analysis", "Visualization", "Big Data", "Statistics", "Business Intelligence"],
  },
  {
    category: "Research",
    color: "sky",
    items: ["Academic Writing", "Open Source", "Robotics", "Blockchain", "AR/VR"],
  },
];

const colorMap: Record<string, { bg: string; selected: string; border: string; tag: string }> = {
  blue: {
    bg: "hover:bg-blue-50",
    selected: "bg-blue-600 text-white border-blue-600",
    border: "border-blue-200",
    tag: "bg-blue-100 text-blue-700",
  },
  sky: {
    bg: "hover:bg-sky-50",
    selected: "bg-sky-600 text-white border-sky-600",
    border: "border-sky-200",
    tag: "bg-sky-100 text-sky-700",
  },
  cyan: {
    bg: "hover:bg-cyan-50",
    selected: "bg-cyan-600 text-white border-cyan-600",
    border: "border-cyan-200",
    tag: "bg-cyan-100 text-cyan-700",
  },
};

export function InterestSelectionPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState("");
  const [customList, setCustomList] = useState<string[]>([]);
  const router = useRouter();

  const toggle = (item: string) => {
    const next = new Set(selected);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setSelected(next);
  };

  const addCustom = () => {
    if (custom.trim() && !customList.includes(custom.trim())) {
      setCustomList([...customList, custom.trim()]);
      setSelected(new Set([...selected, custom.trim()]));
      setCustom("");
    }
  };

  const handleFinish = () => router.push("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={15} />
            Personalize Your Experience
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Select Your Interests</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Choose topics you're passionate about. We'll match you with peers and project ideas that align with your interests.
          </p>
        </motion.div>

        {/* Selected count badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold text-sm shadow-md">
            {selected.size} selected
          </div>
          {selected.size > 0 && (
            <div className="flex flex-wrap gap-2 max-w-lg">
              {[...selected].slice(0, 5).map((s) => (
                <span key={s} className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs text-blue-700 font-medium shadow-sm">
                  {s}
                </span>
              ))}
              {selected.size > 5 && (
                <span className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-600 font-medium">
                  +{selected.size - 5} more
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Interest categories */}
        <div className="space-y-8">
          {INTEREST_CATEGORIES.map((cat, ci) => {
            const colors = colorMap[cat.color];
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6"
              >
                <h3 className="font-bold text-slate-700 mb-4 text-base">{cat.category}</h3>
                <div className="flex flex-wrap gap-3">
                  {cat.items.map((item) => {
                    const isSelected = selected.has(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggle(item)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          isSelected
                            ? colors.selected
                            : `bg-white ${colors.border} text-slate-600 ${colors.bg}`
                        }`}
                      >
                        {isSelected && <Check size={14} />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* Custom interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6"
          >
            <h3 className="font-bold text-slate-700 mb-4 text-base">Add Custom Interest</h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="e.g. Quantum Computing, Game Dev..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={addCustom}
                disabled={!custom.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
            {customList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customList.map((c) => (
                  <span key={c} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center mt-10 gap-3"
        >
          <button
            onClick={handleFinish}
            disabled={selected.size === 0}
            className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            Continue to Dashboard
            <ArrowRight size={20} />
          </button>
          <p className="text-slate-400 text-sm">
            {selected.size === 0 ? "Select at least 1 interest to continue" : `${selected.size} interest${selected.size > 1 ? "s" : ""} selected`}
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}