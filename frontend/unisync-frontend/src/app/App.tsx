"use client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { InterestSelectionPage } from "./pages/InterestSelectionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { MessagesPage } from "./pages/MessagesPage";
import { ProfilePage } from "./pages/ProfilePage";

export type AppUser = {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
};

export default function App() {
  const [user, setUser] = useState<AppUser>({
    name: "Aarav Sharma",
    email: "aarav.sharma@pu.edu.np",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&h=80&fit=crop&crop=face",
    isLoggedIn: false,
  });

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email, avatar: user.avatar, isLoggedIn: true });
  };

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route path="/features" element={<FeaturesPage />} />

          <Route
            path="/interests"
            element={<InterestSelectionPage />}
          />

          <Route
            path="/dashboard"
            element={
              user.isLoggedIn ? (
                <DashboardPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/discover"
            element={
              user.isLoggedIn ? (
                <DiscoverPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/messages"
            element={
              user.isLoggedIn ? (
                <MessagesPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              user.isLoggedIn ? (
                <ProfilePage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}