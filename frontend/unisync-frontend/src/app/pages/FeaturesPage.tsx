import { useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import {
  Users, Lightbulb, FileSignature, MessageSquare, BarChart2, Award,
  Linkedin, Search, Bell, Gamepad2, Shield, Download, Star, Zap
} from "lucide-react";
import { Footer } from "../components/Footer";

const FEATURES_DETAILED = [
  {
    icon: <Users size={28} />,
    title: "Peer Discovery",
    desc: "Our AI-powered recommendation engine matches you with peers who share your interests and academic goals. Similar to Facebook's mutual friends, see shared interests instantly.",
    points: ["AI-powered matching", "Interest-based recommendations", "Mutual connection display", "Faculty filtering"],
    color: "blue",
  },
  {
    icon: <Lightbulb size={28} />,
    title: "Posted Ideas Feed",
    desc: "A scrollable feed of project and research ideas posted by students. Like, comment, and request to join ideas that inspire you.",
    points: ["Real-time feed updates", "Like and comment on ideas", "One-click join requests", "Tag-based browsing"],
    color: "cyan",
  },
  {
    icon: <FileSignature size={28} />,
    title: "Agreements & Contracts",
    desc: "Digital collaboration contracts define roles, responsibilities, deadlines, and penalties. Full accept/reject workflow with project status tracking.",
    points: ["Role assignment (Lead, Contributor, Reviewer)", "Deadline & penalty tracking", "Accept/Reject workflow", "Status: Pending → Active → Completed"],
    color: "blue",
  },
  {
    icon: <MessageSquare size={28} />,
    title: "Messaging & Groups",
    desc: "Real-time chat for groups and private conversations. When an agreement is accepted, a project group is created automatically with file and media sharing.",
    points: ["Auto-created project groups", "Photo & video sharing", "Copy/paste/select in chat", "File and media gallery"],
    color: "sky",
  },
  {
    icon: <BarChart2 size={28} />,
    title: "Activity Logs",
    desc: "A visual timeline of every contribution, badge, project completion, and peer validation. Full transparency of your academic collaboration journey.",
    points: ["Timeline visualization", "Contribution tracking", "Abandonment tags", "Peer validation records"],
    color: "blue",
  },
  {
    icon: <Award size={28} />,
    title: "Badges & Credentials",
    desc: "Earn verified digital badges for completing projects and contributing to the community. Export credentials for your portfolio and LinkedIn.",
    points: ["Project completion badges", "Verified credentials", "Portfolio export (PDF)", "Reputation score display"],
    color: "cyan",
  },
  {
    icon: <Linkedin size={28} />,
    title: "LinkedIn & GitHub Integration",
    desc: "Add your LinkedIn and GitHub profiles to build professional credibility. Profiles display verified links for peer trust.",
    points: ["Clickable profile links", "Trust verification", "Public profile display", "Social proof"],
    color: "blue",
  },
  {
    icon: <Search size={28} />,
    title: "Search & Filters",
    desc: "Global search bar with autocomplete across peers, projects, and interests. Advanced filters by faculty, skill, and category.",
    points: ["Autocomplete suggestions", "Peer and project search", "Faculty & skill filters", "Card-format results"],
    color: "sky",
  },
  {
    icon: <Bell size={28} />,
    title: "Notifications",
    desc: "Real-time alerts for collaboration requests, agreement updates, peer matches, and group activity. Never miss an important update.",
    points: ["Collaboration request alerts", "Agreement status updates", "Peer match notifications", "Group activity alerts"],
    color: "blue",
  },
  {
    icon: <Gamepad2 size={28} />,
    title: "Gamification",
    desc: "Leaderboards, streak counters, and contribution badges keep you motivated. Compete with peers while contributing meaningfully.",
    points: ["Weekly leaderboard", "Contribution streaks", "Achievement badges", "Reputation points"],
    color: "cyan",
  },
  {
    icon: <Shield size={28} />,
    title: "Peer Validation",
    desc: "Peers can endorse and validate each other's contributions after project completion, building a trustworthy academic reputation.",
    points: ["Contribution endorsements", "Star ratings", "Verified feedback", "Trust score building"],
    color: "blue",
  },
  {
    icon: <Download size={28} />,
    title: "Credential Export",
    desc: "Export your badges, project logs, and collaboration history as a professional portfolio PDF, ready for job applications and LinkedIn.",
    points: ["PDF export", "Badge certificates", "Collaboration history", "LinkedIn-ready format"],
    color: "sky",
  },
];

const colorMap = {
  blue: "bg-blue-600",
  cyan: "bg-cyan-600",
  sky: "bg-sky-600",
};

const borderMap = {
  blue: "border-blue-200 hover:border-blue-400",
  cyan: "border-cyan-200 hover:border-cyan-400",
  sky: "border-sky-200 hover:border-sky-400",
};

function FeatureDetailCard({ feat, index }: { feat: typeof FEATURES_DETAILED[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all ${borderMap[feat.color]}`}
    >
      <div className={`w-12 h-12 rounded-2xl ${colorMap[feat.color]} text-white flex items-center justify-center mb-5 shadow-md`}>
        {feat.icon}
      </div>
      <h3 className="font-black text-slate-800 text-lg mb-3">{feat.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-5">{feat.desc}</p>
      <ul className="space-y-2">
        {feat.points.map((p, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
            {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function FeaturesPage() {
  const titleRef = useRef(null);
  const inView = useInView(titleRef, { once: true });

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-950 py-20 px-6 text-white text-center relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 right-16 w-32 h-32 border border-blue-600/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-4 left-16 w-24 h-24 border border-blue-500/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap size={18} className="text-blue-300" />
            <span className="text-blue-300 text-sm font-semibold">UniSync Platform</span>
          </div>
          <h1 className="text-5xl font-black mb-4">All Features</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Explore everything UniSync offers to help Pokhara University students connect, collaborate, and build verified academic portfolios.
          </p>
        </motion.div>
      </div>

      {/* Stats banner */}
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "12", label: "Core Features" },
            { value: "2,400+", label: "Active Students" },
            { value: "850+", label: "Projects" },
            { value: "100%", label: "Free for PU Students" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black">{s.value}</div>
              <div className="text-blue-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-black text-slate-900 mb-4">Built for Students, by Students</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Every feature was designed with one goal: making academic collaboration at Pokhara University seamless, verified, and rewarding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DETAILED.map((feat, i) => (
            <FeatureDetailCard key={feat.title} feat={feat} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-16 text-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-black mb-4">Ready to Start Collaborating?</h2>
          <p className="text-blue-200 mb-8">Join thousands of Pokhara University students already using UniSync.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/" className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
              Get Started Free
            </a>
            <a href="/#how-it-works" className="px-8 py-3 bg-blue-500/20 text-white border border-blue-400/40 rounded-xl font-medium hover:bg-blue-500/30 transition-all">
              See How It Works
            </a>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
