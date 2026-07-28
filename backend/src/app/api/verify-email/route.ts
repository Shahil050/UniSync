import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/auth";

const isProd = process.env.NODE_ENV === "production";

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

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);

  const sessionToken = await encode({
    token: {
      sub: updatedUser.id,
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.fullName,
      role: updatedUser.role,
    },
    secret: process.env.AUTH_SECRET!,
    salt: SESSION_COOKIE_NAME,
    maxAge: SESSION_MAX_AGE,
  });

  const response = NextResponse.redirect(`${frontendUrl}/interests?justVerified=true`);

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}