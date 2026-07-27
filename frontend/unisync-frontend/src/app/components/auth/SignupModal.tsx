"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Mail, Lock, Eye, EyeOff, User, Zap, ArrowRight, CheckCircle2, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/src/lib/api/auth";
import { ApiError } from "@/src/lib/api-client";

type SignupModalProps = {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

const FACULTIES = ["Computer Engineering", "Information Technology", "Software Engineering"];

export function SignupModal({ open, onClose, onSwitchToLogin }: SignupModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", faculty: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  // const router = useRouter();

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!form.email.endsWith("@gmail.com") && !form.email.endsWith("@eemc.edu.np")) {
      setError("Please use Gmail or your college (@eemc.edu.np) email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.faculty) {
      setError("Please fill in your name and faculty.");
      return;
    }

    setStep(3);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      await authApi.signup({
        fullName: form.name,
        email: form.email,
        password: form.password,
        department: form.faculty,
      });
      setDone(true);

    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setStep(1);
      } else {
        setError("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();

    // reset everything only after the modal has actually closed
    setTimeout(() => {
      setStep(1);
      setForm({ name: "", email: "", password: "", faculty: "" });
      setDone(false);
      setError("");
    }, 300);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-7 text-white relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/handshake-agreement-icon.avif"
                  alt="UniSync Logo"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
                <div>
                  <div className="font-black text-lg">UniSync</div>
                  <div className="text-blue-300 text-xs">Pokhara University</div>
                </div>
              </div>
              <h2 className="text-2xl font-black mb-1">Create Account</h2>
              <p className="text-blue-200 text-sm">{done ? "Almost there" : `Step ${step} of 3`}</p>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(done ? 3 : step) / 3 * 100}%` }}
                  className="h-full bg-white rounded-full"
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="p-8">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-5">
                  {error}
                </div>
              )}
              {done ? (
                <div className="text-center space-y-5">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <MailCheck size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">Check your inbox</h3>
                    <p className="text-slate-500 text-sm">
                      We've sent a verification link to{" "}
                      <span className="font-semibold text-blue-700">{form.email}</span>. Click it to activate your account, then sign in.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleClose();
                      onSwitchToLogin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                  >
                    Go to Sign In <ArrowRight size={16} />
                  </button>
                </div>
              ) : step === 1 ? (
                <form onSubmit={handleStep1} className="space-y-5">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Account Details</h3>
                    <p className="text-slate-500 text-sm">Enter your Gmail or college email to get started.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@eemc.edu.np"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </form>
              ) : step === 2 ? (
                <form onSubmit={handleStep2} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Faculty</label>
                    <select
                      required
                      value={form.faculty}
                      onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                    >
                      <option value="">Select your faculty</option>
                      {FACULTIES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-5">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">You're almost in!</h3>
                    <p className="text-slate-500 text-sm">
                      Review your details below.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-left border border-blue-100">
                    <p className="text-slate-700 text-sm"><span className="font-semibold">Name:</span> {form.name}</p>
                    <p className="text-slate-700 text-sm"><span className="font-semibold">Email:</span> {form.email}</p>
                    <p className="text-slate-700 text-sm"><span className="font-semibold">Faculty:</span> {form.faculty}</p>
                    
                  </div>
                  <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Create Account <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              )}

              {!done && (
                <p className="text-center text-sm text-slate-500 mt-6">
                  Already have an account?{" "}
                  <button onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline">
                    Sign In
                  </button>
                </p>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}