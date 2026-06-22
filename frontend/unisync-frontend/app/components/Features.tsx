"use client";

import {
  Users,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Users size={36} />,
      title: "Peer Matching",
      description:
        "Connect with students who share your interests, courses, and academic goals.",
    },
    {
      icon: <MessageCircle size={36} />,
      title: "Study Groups",
      description:
        "Collaborate in real-time with classmates through interactive study communities.",
    },
    {
      icon: <BookOpen size={36} />,
      title: "Resource Sharing",
      description:
        "Access notes, PDFs, assignments, and learning resources shared by peers.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#3B0A0A] via-[#5A120C] to-[#1A0808] text-white">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-orange-300 text-sm">
            Features
          </span>

          <h2 className="mt-6 text-5xl font-bold">
            Why Choose UniSync?
          </h2>

          <p className="mt-6 text-white/70 text-lg">
            Empowering students through collaboration,
            knowledge sharing, and peer-to-peer learning.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {features.map((feature, index) => (
            <div
              key={index}
              className="
                group
                relative
                p-8
                rounded-3xl
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                shadow-xl
                hover:scale-105
                hover:bg-white/10
                transition-all
                duration-500
              "
            >

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-semibold">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-white/70 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-orange-500/5 to-red-500/5" />

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}