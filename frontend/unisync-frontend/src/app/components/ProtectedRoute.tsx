"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../UserContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, checkingSession } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!checkingSession && !user.isLoggedIn) {
      router.replace("/");
    }
  }, [checkingSession, user.isLoggedIn, router]);

  if (checkingSession || !user.isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}