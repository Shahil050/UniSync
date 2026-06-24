"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import {
  MailCheck, Sliders, Users, FileSignature, MessageSquare, Award
} from "lucide-react";

const STEPS = [
  {
    icon: <MailCheck size={28} />,
    title: "Sign Up with University Email",
    desc: "Register using your official Pokhara University email for verified academic identity.",
    color: "bg-blue-600",
    img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=250&fit=crop",
  },
  {
    icon: <Sliders size={28} />,
    title: "Select Your Interests",
    desc: "Choose from AI, Networking, Cybersecurity, Software Engineering and more to personalize your feed.",
    color: "bg-blue-500",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
  },
  {
    icon: <Users size={28} />,
    title: "Discover Peers & Ideas",
    desc: "Browse recommended peers and posted project ideas based on your interests and skills.",
    color: "bg-blue-700",
    img: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400&h=250&fit=crop",
  },
  {
    icon: <FileSignature size={28} />,
    title: "Create Agreements",
    desc: "Form digital collaboration contracts with defined roles, deadlines, and responsibilities.",
    color: "bg-blue-800",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
  },
  {
    icon: <MessageSquare size={28} />,
    title: "Work in Groups",
    desc: "Chat, share files, photos, and videos in auto-created project groups. Threaded discussions for clarity.",
    color: "bg-cyan-600",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=250&fit=crop",
  },
  {
    icon: <Award size={28} />,
    title: "Earn Badges & Feedback",
    desc: "Receive verified badges, reputation scores, and peer feedback upon project completion.",
    color: "bg-blue-600",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop",
  },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 overflow-hidden group transition-all hover:-translate-y-1"
    >
      {/* Step image */}
      <div className="relative overflow-hidden h-40">
        <img
          src={step.img}
          alt={step.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
        {/* Step number */}
        <div className={`absolute top-3 left-3 ${step.color} text-white w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-lg`}>
          {index + 1}
        </div>
        {/* Icon */}
        <div className="absolute bottom-3 right-3 text-white/80">
          {step.icon}
        </div>
      </div>
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 mb-2 text-base">{step.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export function HowItWorksSection() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Your Journey on UniSync
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            From registration to project completion — a seamless workflow designed for Pokhara University students.
          </p>
        </motion.div>

        {/* Timeline connector (desktop) */}
        <div className="hidden lg:block relative mb-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 -translate-y-1/2" />
          <div className="flex justify-between px-12">
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-md z-10"
              />
            ))}
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}