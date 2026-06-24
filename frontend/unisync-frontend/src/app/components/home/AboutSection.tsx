"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const TEAM_IMG = "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzgyMjYwMTA5fDA&ixlib=rb-4.1.0&q=80&w=1080";

const POINTS = [
  "Built exclusively for Pokhara University students",
  "AI-powered peer matching and recommendation engine",
  "Verified academic identity via university email",
  "Digital agreements with accountability tracking",
  "Integrated badge & credential export system",
  "Real-time collaboration tools with media support",
];

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-blue-50" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={TEAM_IMG} alt="Students at Pokhara University" className="w-full h-96 object-cover" />
            </div>
            {/* Decorative card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 max-w-xs border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Verified Platform</p>
                  <p className="text-blue-500 text-xs">Academic-grade security</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs">Only verified PU students can join, ensuring a trusted collaboration environment.</p>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              About UniSync
            </span>
            <h2 className="text-4xl font-black text-slate-900 mb-5 leading-tight">
              The Collaboration Platform Built for PU Students
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              UniSync was created to solve a real problem: brilliant students at Pokhara University lacked a structured way to find peers, manage collaborations, and build a verifiable portfolio. Our platform bridges that gap with AI-powered tools.
            </p>
            <ul className="space-y-3 mb-8">
              {POINTS.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-3 text-slate-700 text-sm"
                >
                  <CheckCircle2 size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  {p}
                </motion.li>
              ))}
            </ul>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "3", label: "Faculties" },
                { value: "50+", label: "Departments" },
                { value: "10K+", label: "Students" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border border-blue-100">
                  <div className="text-2xl font-black text-blue-700">{s.value}</div>
                  <div className="text-slate-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
