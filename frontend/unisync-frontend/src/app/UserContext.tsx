"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/src/lib/api/auth";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "STUDENT" | "ADMIN";
  isLoggedIn: boolean;
};

type UserContextType = {
  user: AppUser;
  checkingSession: boolean;
  onLogin: (id: string, name: string, email: string, role: "STUDENT" | "ADMIN") => void;
  onLogout: () => void;
  loginOpen: boolean;
  signupOpen: boolean;
  openLogin: () => void;
  openSignup: () => void;
  closeModals: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&h=80&fit=crop&crop=face";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>({
    id: "",
    name: "",
    email: "",
    avatar: DEFAULT_AVATAR,
    role: "STUDENT",
    isLoggedIn: false,
  });
  const [checkingSession, setCheckingSession] = useState(true);

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    authApi
      .me()
      .then((res) => {
        setUser({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          avatar: DEFAULT_AVATAR,
          role: res.user.role ?? "STUDENT",
          isLoggedIn: true,
        });
      })
      .catch(() => {
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const onLogin = (id: string, name: string, email: string, role: "STUDENT" | "ADMIN") => {
    setUser((u) => ({ id, name, email, avatar: u.avatar, role, isLoggedIn: true }));
  };

  const onLogout = () => {
    setUser((u) => ({ ...u, isLoggedIn: false }));
  };

  const openLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };

  const openSignup = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  const closeModals = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        checkingSession,
        onLogin,
        onLogout,
        loginOpen,
        signupOpen,
        openLogin,
        openSignup,
        closeModals,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}