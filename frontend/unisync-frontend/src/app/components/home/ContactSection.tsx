"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="py-24 bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Get in Touch
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Contact Us</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Have questions about UniSync? We'd love to hear from you. Reach out to our team at Pokhara University.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="font-bold text-slate-800 text-lg mb-6">Contact Information</h3>
              {[
                { icon: <Mail size={20} />, label: "Email", value: "unisync@pu.edu.np" },
                { icon: <MapPin size={20} />, label: "Location", value: "Pokhara University, Lekhnath, Pokhara" },
                { icon: <Phone size={20} />, label: "Phone", value: "+977-61-504001" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4 mb-5 last:mb-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{c.label}</p>
                    <p className="text-slate-800 font-semibold">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white">
              <h3 className="font-bold text-lg mb-2">Join 2,400+ Students</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Be part of a thriving academic community. Connect with peers, collaborate on projects, and build your professional portfolio.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <CheckCircle2 size={48} className="text-blue-500 mb-4" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-bold text-slate-800 text-lg mb-2">Send a Message</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@pu.edu.np"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}