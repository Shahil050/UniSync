"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white"
        >
          UniSync
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-white/80 hover:text-orange-300 transition"
          >
            Home
          </Link>

          <Link
            href="/features"
            className="text-white/80 hover:text-orange-300 transition"
          >
            Features
          </Link>

          <Link
            href="/about"
            className="text-white/80 hover:text-orange-300 transition"
          >
            About
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-white text-[#8B1E12] hover:bg-orange-100 transition font-semibold"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/20 backdrop-blur-md border-t border-white/10 shadow-lg">
          <div className="flex flex-col p-4 space-y-4">

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-orange-300"
            >
              Home
            </Link>

            <Link
              href="/features"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-orange-300"
            >
              Features
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-orange-300"
            >
              About
            </Link>

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg border border-white/20 text-white text-center"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 rounded-full bg-white text-[#8B1E12] hover:bg-orange-100 transition text-center font-semibold"
            >
              Sign Up
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}