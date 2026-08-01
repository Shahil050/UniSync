import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: { id: req.auth.user.id, deletedAt: null },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      profileImage: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
});