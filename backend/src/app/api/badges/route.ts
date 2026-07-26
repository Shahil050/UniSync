import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const badges = await prisma.badge.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ success: true, badges });
});