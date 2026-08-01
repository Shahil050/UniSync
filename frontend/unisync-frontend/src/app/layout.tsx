"use client";

import "../styles/index.css";
import { UserProvider } from "./UserContext";
import { Navbar } from "./components/Navbar";
import { ModalsRenderer } from "./ModalsRenderer";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/discover") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/ideas") ||
    pathname.startsWith("/agreements") ||
    pathname.startsWith("/activity") ||
    pathname.startsWith("/notifications");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <LayoutContent>{children}</LayoutContent>
          <ModalsRenderer />
        </UserProvider>
      </body>
    </html>
  );
}