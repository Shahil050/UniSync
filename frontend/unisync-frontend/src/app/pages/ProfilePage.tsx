import { ProfileSection } from "../components/dashboard/ProfileSection";
import { ActivityLogs } from "../components/dashboard/ActivityLogs";
import { Footer } from "../components/Footer";
import { User } from "lucide-react";
import { motion } from "motion/react";
import type { AppUser } from "../App";

export function ProfilePage({ user }: { user: AppUser }) {
  return (
    <div className="min-h-screen bg-blue-50/50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <User size={24} />
            <div>
              <h1 className="text-3xl font-black">My Profile</h1>
              <p className="text-blue-200 text-sm">Manage your academic profile and credentials</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileSection user={user} />
        </div>
        <div>
          <ActivityLogs />
        </div>
      </div>
      <Footer />
    </div>
  );
}
