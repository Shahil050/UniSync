"use client";

import "./login.css";

export default function LoginPage() {
  return (
    <div className="login-wrapper">

      {/* background effects */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="login-card">

        {/* logo */}
        <div className="logo">U</div>

        <h1>Welcome Back</h1>
        <p>Sign in to continue to UniSync</p>

        {/* form */}
        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit">Login</button>
        </form>

        <p className="footer">
          Join thousands of students learning together.
        </p>
      </div>
    </div>
  );
}