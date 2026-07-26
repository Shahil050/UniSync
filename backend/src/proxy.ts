// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";

const FRONTEND_URL = process.env.FRONTEND_URL;

export function proxy(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return corsResponse(new NextResponse(null, { status: 204 }), origin);
  }

  const res = NextResponse.next();
  return corsResponse(res, origin);
}

function corsResponse(res: NextResponse, origin: string | null) {
  if (origin && origin === FRONTEND_URL) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return res;
}

export const config = {
  matcher: "/api/:path*",
};