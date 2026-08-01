"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "../components/admin/AdminDashboard";
import { authApi } from "@/src/lib/api/auth";

export default function AdminPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    authApi
      .me()
      .then((res) => {
        if (res.user.role !== "ADMIN") {
          router.replace("/admin/login");
          return;
        }
        setChecked(true);
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [router]);
 
  if (!checked) return null;
 
  return <AdminDashboard />;
}
