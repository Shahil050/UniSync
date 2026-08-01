"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "../components/admin/AdminDashboard";
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (!loggedIn) {
      router.replace("/admin/login");
    }
  }, [router]);

  return <AdminDashboard />;
}
