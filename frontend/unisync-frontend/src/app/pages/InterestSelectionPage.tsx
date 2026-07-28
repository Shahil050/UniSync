"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Plus, ArrowRight, Sparkles } from "lucide-react";
import { Footer } from "../components/Footer";
import { usersApi } from "@/src/lib/api/users";
import { ApiError } from "@/src/lib/api-client";

type Skill = { id: string; name: string; type: string; category: string | null };

const colorCycle = ["blue", "sky", "cyan"] as const;

const colorMap: Record<string, { bg: string; selected: string; border: string }> = {
  blue: {
    bg: "hover:bg-blue-50",
    selected: "bg-blue-600 text-white border-blue-600",
    border: "border-blue-200",
  },
  sky: {
    bg: "hover:bg-sky-50",
    selected: "bg-sky-600 text-white border-sky-600",
    border: "border-sky-200",
  },
  cyan: {
    bg: "hover:bg-cyan-50",
    selected: "bg-cyan-600 text-white border-cyan-600",
    border: "border-cyan-200",
  },
};

export function InterestSelectionPage() {
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("justVerified") === "true";
  const router = useRouter();

  const [categories, setCategories] = useState<{ category: string; items: Skill[] }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi
      .listSkills()
      .then((res) => {
        const grouped = new Map<string, Skill[]>();
        for (const skill of res.skills as Skill[]) {
          const cat = skill.category ?? "Other";
          if (!grouped.has(cat)) grouped.set(cat, []);
          grouped.get(cat)!.push(skill);
        }
        setCategories([...grouped.entries()].map(([category, items]) => ({ category, items })));
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not load interests.");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  // const addCustom = () => {
  //   if (custom.trim() && !customList.includes(custom.trim())) {
  //     setCustomList([...customList, custom.trim()]);
  //     setSelected(new Set([...selected, custom.trim()]));
  //     setCustom("");
  //   }
  // };

  const handleFinish = async () => {
    setSubmitting(true);
    setError("");
    try {
      await usersApi.setSkills([...selected].map((skillId) => ({ skillId })));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save your interests.");
      setSubmitting(false);
    }
  };

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

        {justVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-5 py-4 bg-green-50 border border-green-200 rounded-2xl text-center"
          >
            <p className="text-green-700 font-semibold text-sm">
             Your email is verified! Let's set up your profile.
            </p>
            <p className="text-green-700 font-semibold text-sm">
             Choose your interests to get started.
            </p>
          </motion.div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Selected count badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold text-sm shadow-md">
            {selected.size} selected
          </div>
          {/* {selected.size > 0 && (
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
          )} */}
        </motion.div>

        {/* Interest categories */}
        {loading ? (
          <p className="text-center text-slate-400">Loading interests...</p>
        ) : (
          <div className="space-y-8">
            {categories.map((cat, ci) => {
              const colors = colorMap[colorCycle[ci % colorCycle.length]];
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
                    {cat.items.map((skill) => {
                      const isSelected = selected.has(skill.id);
                      return (
                        <button
                          key={skill.id}
                          onClick={() => toggle(skill.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                            isSelected
                              ? colors.selected
                              : `bg-white ${colors.border} text-slate-600 ${colors.bg}`
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

          {/* Custom interests */}
          {/* <motion.div
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
        </div> */}

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center mt-10 gap-3"
        >
          <button
            onClick={handleFinish}
            disabled={selected.size === 0 || submitting}
            className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {submitting ? "Saving..." : "Continue to Dashboard"}
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