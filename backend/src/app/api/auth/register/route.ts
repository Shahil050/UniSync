import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { fullName, email, password } = await req.json();

  // ── Basic validation ──────────────────────────────────────────────
  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "fullName, email and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  // ── Domain check ──────────────────────────────────────────────────
  const domain = email.split("@")[1]?.toLowerCase();
  const institution = domain
    ? await prisma.institution.findUnique({ where: { domain } })
    : null;

  if (!institution) {
    return NextResponse.json(
      { error: "Only Pokhara University affiliated college emails are allowed." },
      { status: 403 }
    );
  }

  // ── Duplicate check ───────────────────────────────────────────────
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  // ── Create user + verification token ─────────────────────────────
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      institutionId: institution.id,
    },
  });

  const token = await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    },
  });

  await sendVerificationEmail({ to: email, token: token.token });

  return NextResponse.json(
    { message: "Account created. Please check your email to verify your account." },
    { status: 201 }
  );
}