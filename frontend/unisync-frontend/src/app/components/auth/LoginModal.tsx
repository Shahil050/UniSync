"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/src/lib/api/auth";
import { ApiError } from "@/src/lib/api-client";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin: (id: string, name: string, email: string) => void;
  onSwitchToSignup: () => void;
};

export function LoginModal({ open, onClose, onLogin, onSwitchToSignup }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      onLogin(res.user.id, res.user.name, res.user.email);
      onClose();
      setEmail("");
      setPassword("");
      router.push("/dashboard");

    } catch (err) {
      if (err instanceof ApiError) {
        setError("Something went wrong. Please try again.");
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/20">
                  <Image src="/handshake-agreement-icon.avif" alt="UniSync logo" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-black text-lg">UniSync</div>
                  <div className="text-blue-300 text-xs">Secure Authentication</div>
                </div>
              </div>
              <h2 className="text-2xl font-black mb-1">Welcome Back</h2>
              <p className="text-blue-200 text-sm">
                Sign in with your college email.
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@eemc.edu.np"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Use Gmail or your college email</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" className="rounded accent-blue-600" />
                    Remember me
                  </label>
                  <button type="button" className="text-blue-600 hover:underline font-medium">
                    Forgot Password?
                  </button>
                </div> */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Continue <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            
              <p className="text-center text-sm text-slate-500 mt-6">
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}