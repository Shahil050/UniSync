"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();


  const adminProfile = {
    name: "Kajal Kushwaha",
    email: email,
    role: "Super Admin",
    lastLogin: new Date().toLocaleDateString(),
    image: "/unisync-logo.png",
  };


  localStorage.setItem(
    "adminLoggedIn",
    "true"
  );


  localStorage.setItem(
    "adminProfile",
    JSON.stringify(adminProfile)
  );


  router.push("/admin");
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      
      <div className="w-full max-w-md">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg p-3">
  <Image
    src="/logo.avif"
    alt="UniSync Logo"
    width={80}
    height={80}
    className="object-contain"
  />
</div>

          <h1 className="mt-4 text-3xl font-bold text-white">
            Admin Portal
          </h1>

          <p className="mt-2 text-sm text-gray-300">
            Sign in to manage your platform
          </p>
        </div>


        {/* Login Card */}
        <div className="rounded-2xl bg-white/95 backdrop-blur p-8 shadow-2xl">

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>

                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full rounded-lg border px-10 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
            </div>


            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full rounded-lg border px-10 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
            </div>


            {/* Remember */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-gray-600">
                <input 
                  type="checkbox"
                  className="rounded"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </button>

            </div>


            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              Sign In
            </button>

          </form>


          <div className="mt-6 text-center text-xs text-gray-500">
            © 2026 UniSync Admin Panel
          </div>

        </div>

      </div>

    </div>
  );
}