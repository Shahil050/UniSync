"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/src/lib/api/auth";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "STUDENT" | "ADMIN";
  isLoggedIn: boolean;
};

type UserContextType = {
  user: AppUser;
  checkingSession: boolean;
  onLogin: (id: string, name: string, email: string, role: "STUDENT" | "ADMIN", profileImage?: string | null) => void;
  onLogout: () => void;
  loginOpen: boolean;
  signupOpen: boolean;
  openLogin: () => void;
  openSignup: () => void;
  closeModals: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>({
    id: "",
    name: "",
    email: "",
    avatar: null,
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
          avatar: res.user.profileImage ?? null,
          role: res.user.role ?? "STUDENT",
          isLoggedIn: true,
        });
      })
      .catch(() => {
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const onLogin = (id: string, name: string, email: string, role: "STUDENT" | "ADMIN", profileImage?: string | null) => {
    setUser({ id, name, email, avatar: profileImage ?? null, role, isLoggedIn: true });
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