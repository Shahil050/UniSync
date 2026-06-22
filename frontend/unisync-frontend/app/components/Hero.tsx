"use client";

import {
  ArrowRight,
  Users,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#3B0A0A] via-[#8B1E12] to-[#F97316]">

      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Premium Glass Container */}
        <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">

          <div className="grid lg:grid-cols-2 gap-12 items-center p-8 lg:p-16 min-h-[85vh]">

            {/* LEFT CONTENT */}
            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-md">
                <Users size={18} />
                Peer-to-Peer Learning Platform
              </div>

              <h1 className="mt-8 text-5xl md:text-7xl font-bold text-white leading-tight">
                Learn Together.
                <br />
                <span className="text-orange-300">
                  Grow Smarter.
                </span>
              </h1>

              <p className="mt-6 text-lg text-white/80 max-w-xl">
                Connect with students, join study groups,
                share resources, and learn collaboratively
                with peers across different disciplines.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <button className="bg-white text-[#e1685b] px-7 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition">
                  Get Started
                  <ArrowRight size={18} />
                </button>

                <button className="border border-white/20 text-white px-7 py-3 rounded-full hover:bg-white/10 transition">
                  Explore Platform
                </button>

              </div>

              {/* Stats */}
              <div className="flex gap-10 mt-12 text-white">

                <div>
                  <h3 className="text-3xl font-bold">5K+</h3>
                  <p className="text-white/70">Students</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">1200+</h3>
                  <p className="text-white/70">Study Sessions</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">300+</h3>
                  <p className="text-white/70">Peer Mentors</p>
                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="relative">

              {/* Main Image Card */}
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

                <img
                  src="/i6.jpg"
                  alt="UniSync"
                  className="w-full h-[550px] object-cover"
                />

              </div>

              {/* Floating Card 1 */}
              <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white w-56 shadow-xl">

                <Users
                  size={32}
                  className="text-orange-300"
                />

                <h4 className="font-semibold mt-3">
                  Peer Matching
                </h4>

                <p className="text-sm text-white/70 mt-1">
                  Find students with similar goals.
                </p>

              </div>

              {/* Floating Card 2 */}
              <div className="absolute bottom-24 left-0 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white w-56 shadow-xl">

                <BookOpen
                  size={32}
                  className="text-yellow-300"
                />

                <h4 className="font-semibold mt-3">
                  Resource Sharing
                </h4>

                <p className="text-sm text-white/70 mt-1">
                  Exchange notes, PDFs and study materials.
                </p>

              </div>

              {/* Floating Card 3 */}
              <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white w-60 shadow-xl">

                <MessageCircle
                  size={32}
                  className="text-green-300"
                />

                <h4 className="font-semibold mt-3">
                  Study Groups
                </h4>

                <p className="text-sm text-white/70 mt-1">
                  Collaborate and learn together.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}