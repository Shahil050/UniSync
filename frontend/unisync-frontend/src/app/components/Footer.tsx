"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/handshake-agreement-icon.avif"
                  alt="UniSync Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>

              <div>
                <div className="font-black text-lg">UniSync</div>
                <div className="text-blue-300 text-xs uppercase tracking-widest">
                  Pokhara University
                </div>
              </div>
            </div>

            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              AI-augmented peer collaboration platform for Computer, IT, and
              Software Engineering students at Pokhara University.
            </p>

            <div className="flex items-center gap-2 mt-3 text-blue-300 text-sm">
              <MapPin size={14} />
              <span>Pokhara, Gandaki Province, Nepal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-4">
              Platform
            </h4>

            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/features", label: "Features" },
                { to: "/discover", label: "Discover Peers" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/messages", label: "Messages" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    href={l.to}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-blue-300 mb-4">
              Connect
            </h4>

            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:unisync@pu.edu.np"
                  className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
                >
                  <Mail size={14} />
                  unisync@pu.edu.np
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
                >
                  <Github size={14} />
                  GitHub
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-blue-400">
          <p>© 2025 UniSync · Pokhara University · All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}