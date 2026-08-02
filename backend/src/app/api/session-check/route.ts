import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async function GET(req) {
  const session = req.auth;

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated." },
      { status: 401 }
    );
  }

  // profileImage isn't in the JWT, so pull it fresh from the DB.
  const dbUser = await prisma.user.findFirst({
    where: { id: session.user.id, deletedAt: null },
    select: { profileImage: true },
  });

  return NextResponse.json({
    success: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      profileImage: dbUser?.profileImage ?? null,
    },
  });
});