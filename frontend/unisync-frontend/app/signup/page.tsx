"use client";

export default function SignupPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#3B0A0A] via-[#8B1E12] to-[#F97316] flex items-center justify-center p-6">

      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-10">

        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-bold text-[#e1685b] text-sm">
            U
          </div>
          <span className="text-white font-bold text-lg">UniSync</span>
        </div>

        <h1 className="text-3xl font-bold text-white leading-tight">
          Create account
        </h1>
        <p className="mt-2 text-white/70 text-sm">
          Join UniSync and start collaborating
        </p>

        <form className="mt-7 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs text-white/75">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Full name"
              className="px-4 py-3 rounded-xl border border-white/15 bg-white/[0.07] text-white text-sm placeholder-white/40 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs text-white/75">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="px-4 py-3 rounded-xl border border-white/15 bg-white/[0.07] text-white text-sm placeholder-white/40 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs text-white/75">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="px-4 py-3 rounded-xl border border-white/15 bg-white/[0.07] text-white text-sm placeholder-white/40 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-xs text-white/75">Confirm password</label>
            <input
              id="confirm"
              type="password"
              placeholder="Confirm password"
              className="px-4 py-3 rounded-xl border border-white/15 bg-white/[0.07] text-white text-sm placeholder-white/40 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300/20 transition"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-white text-[#e1685b] py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Create account
          </button>

        </form>

        <p className="mt-5 text-center text-sm text-white/70">
          Already have an account?{" "}
          <a href="/login" className="text-white font-medium underline">
            Log in
          </a>
        </p>

      </div>
    </section>
  );
}