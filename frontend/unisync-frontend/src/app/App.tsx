"use client";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { InterestSelectionPage } from "./pages/InterestSelectionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { MessagesPage } from "./pages/MessagesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { useUser } from "./UserContext";

export default function App() {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/interests" element={<InterestSelectionPage />} />

          <Route
            path="/dashboard"
            element={user.isLoggedIn ? <DashboardPage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/discover"
            element={user.isLoggedIn ? <DiscoverPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/messages"
            element={user.isLoggedIn ? <MessagesPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/profile"
            element={user.isLoggedIn ? <ProfilePage /> : <Navigate to="/" replace />}
          />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}