"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Mail, Lock, Eye, EyeOff, User, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type SignupModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
  onSwitchToLogin: () => void;
};

const FACULTIES = ["Computer Engineering", "Information Technology", "Software Engineering"];

export function SignupModal({ open, onClose, onLogin, onSwitchToLogin }: SignupModalProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", faculty: "" });
  const [showPass, setShowPass] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) {
      setError("Please enter your email");
      return;
    }
    if (!form.email.endsWith("@gmail.com") && !form.email.includes("@college")) {
      setError("Please use Gmail or your college email address.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1200));
    setVerificationSent(true);
    setLoading(false);
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinish = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onLogin(form.name, form.email);
    setLoading(false);
    onClose();
    router.push("/interests");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm"
            onClick={onClose}
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
                onClick={onClose}
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
              <p className="text-blue-200 text-sm">Step {step} of 3</p>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(step / 3) * 100}%` }}
                  className="h-full bg-white rounded-full"
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="p-8">
              {/* Step 1: Email + Password */}
              {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-5">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Account Details</h3>
                    <p className="text-slate-500 text-sm">Enter your Gmail or college email to get started.</p>
                  </div>

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
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@gmail.com"
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
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send Verification Email <ArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Profile details */}
              {step === 2 && (
                <form onSubmit={handleStep2} className="space-y-5">
                  {verificationSent && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                      <CheckCircle2 size={16} />
                      Verification email sent to {form.email}
                    </div>
                  )}
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
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="text-center space-y-5">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">You're almost in!</h3>
                    <p className="text-slate-500 text-sm">
                      Welcome, {form.name}! Next, select your interests to personalize your experience.
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
                      <>Select Interests <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              )}

              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <button onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}