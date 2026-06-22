import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Token is required." },
      { status: 400 }
    );
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return NextResponse.json(
      { error: "Invalid or already used verification link." },
      { status: 400 }
    );
  }

  if (record.expiresAt < new Date()) {
    // Clean up the expired token so the user can request a fresh one
    await prisma.emailVerificationToken.delete({ where: { token } });
    return NextResponse.json(
      { error: "Verification link has expired. Please request a new one." },
      { status: 410 }
    );
  }

  // Mark verified and delete the token in one transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);

  // Redirect to login page with a success flag the UI can read
  return NextResponse.redirect(new URL("/auth/login?verified=true", req.url));
}