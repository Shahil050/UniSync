"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AppUser = {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
};

type UserContextType = {
  user: AppUser;
  onLogin: (name: string, email: string) => void;
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
    name: "Aarav Sharma",
    email: "aarav.sharma@pu.edu.np",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&h=80&fit=crop&crop=face",
    isLoggedIn: false,
  });

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const onLogin = (name: string, email: string) => {
    setUser({ name, email, avatar: user.avatar, isLoggedIn: true });
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
      value={{ user, onLogin, onLogout, loginOpen, signupOpen, openLogin, openSignup, closeModals }}
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