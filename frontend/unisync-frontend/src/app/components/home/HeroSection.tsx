"use client";

import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Image from "next/image";
import { ArrowRight, Sparkles, Users, Star, BookOpen } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbmV0d29ya2luZyUyMG1vZGVybiUyMGFic3RyYWN0JTIwYmx1ZXxlbnwxfHx8fDE3ODIyNjAxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080";
const STUDENTS_IMG = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzgyMjYwMTA5fDA&ixlib=rb-4.1.0&q=80&w=1080";

const stats = [
  { icon: <Users size={18} />, value: "2,400+", label: "Active Students" },
  { icon: <BookOpen size={18} />, value: "850+", label: "Projects Posted" },
  { icon: <Star size={18} />, value: "98%", label: "Satisfaction Rate" },
];

type HeroProps = {
  onLoginClick: () => void;
  onSignupClick: () => void;
};

export function HeroSection({ onLoginClick, onSignupClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      {/* Animated blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Sparkles size={14} />
            AI-Powered Collaboration · Pokhara University
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
          >
            Connect. Collaborate.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              Create Together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-blue-200 text-lg leading-relaxed mb-8 max-w-lg"
          >
            UniSync is the AI-augmented peer collaboration platform built exclusively for Pokhara University students in Computer, IT, and Software Engineering faculties.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <button
              onClick={onSignupClick}
              className="flex items-center gap-2 px-7 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-7 py-3.5 bg-blue-500/20 text-white border border-blue-400/40 rounded-xl font-medium hover:bg-blue-500/30 transition-all backdrop-blur-sm"
            >
              Sign In
            </button>
            <Link
              to="/features"
              className="flex items-center gap-2 px-7 py-3.5 text-blue-300 hover:text-white text-sm font-medium transition-colors underline-offset-4 hover:underline"
            >
              Explore Features →
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <div className="text-blue-300">{s.icon}</div>
                <div>
                  <div className="font-bold text-lg leading-none">{s.value}</div>
                  <div className="text-blue-300 text-xs">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Image card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          {/* Main image */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-400/30"
          >
            <Image
  src="/group7.jpg"
  alt="Students collaborating"
  width={700}
  height={500}
  className="w-full h-80 object-cover"
/>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-semibold text-sm">Pokhara University Students</p>
              <p className="text-blue-200 text-xs">Collaborating on real projects together</p>
            </div>
          </motion.div>

          {/* Floating badge card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-blue-600" fill="#2563eb" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">Badge Earned!</div>
              <div className="text-blue-500 text-xs">AI Project Contributor</div>
            </div>
          </motion.div>

          {/* Floating peer card */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
  {[
    "/kajal.jpg",
    "/shahil.jpg",
    "/rabindra.jpg",
  ].map((image, index) => (
    <img
      key={index}
      src={image}
      alt="peer"
      className="w-8 h-8 rounded-full border-2 border-white object-cover"
    />
  ))}
</div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">3 peers matched</div>
              <div className="text-blue-400 text-xs">Similar interests</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 20C1200 80 720 0 0 60V80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}