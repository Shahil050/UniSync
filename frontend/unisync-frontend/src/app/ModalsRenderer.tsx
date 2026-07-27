"use client";

import { LoginModal } from "./components/auth/LoginModal";
import { SignupModal } from "./components/auth/SignupModal";
import { useUser } from "./UserContext";

export function ModalsRenderer() {
  const { loginOpen, signupOpen, onLogin, closeModals, openLogin, openSignup } = useUser();

  return (
    <>
      <LoginModal
        open={loginOpen}
        onClose={closeModals}
        onLogin={onLogin}
        onSwitchToSignup={openSignup}
      />
      <SignupModal
        open={signupOpen}
        onClose={closeModals}
        onLogin={onLogin}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}