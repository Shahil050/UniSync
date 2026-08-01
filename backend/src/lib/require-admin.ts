import { NextResponse } from "next/server";
import { auth } from "@/auth";

export function requireAdmin<T extends (...args: any[]) => any>(handler: T) {
  return auth(async (req: any, ...rest: any[]) => {
    if (!req.auth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (req.auth.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(req, ...rest);
  });
}