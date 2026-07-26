// src/app/api/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const frontendUrl = process.env.FRONTEND_URL!;

  if (!token) {
    return NextResponse.redirect(`${frontendUrl}/?verifyError=missing-token`);
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return NextResponse.redirect(`${frontendUrl}/?verifyError=invalid`);
  }

  if (record.expiresAt < new Date()) {
    await prisma.emailVerificationToken.delete({ where: { token } });
    return NextResponse.redirect(`${frontendUrl}/?verifyError=expired`);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);

  return NextResponse.redirect(`${frontendUrl}/?verified=true`);
}