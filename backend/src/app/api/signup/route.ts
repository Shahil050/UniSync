import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { Prisma } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const { fullName, email, password, department } = await req.json();

  // Basic validation
  if (!fullName || !email || !password || !department) {
    return NextResponse.json(
      { success: false, message: "fullName, email, password and department are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, message: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { success: false, message: "Invalid email format." },
      { status: 400 }
    );
  }

  // Normalize
  const normalizedEmail = email.toLowerCase().trim();
  const domain = normalizedEmail.split("@")[1];

  // Domain check
  const institution = await prisma.institution.findUnique({ where: { domain } });

  if (!institution) {
    return NextResponse.json(
      { success: false, message: "Only Pokhara University affiliated college emails are allowed." },
      { status: 403 }
    );
  }

  // Create user + verification token atomically
  const passwordHash = await bcrypt.hash(password, 12);
  const trimmedDepartment = typeof department === "string" ? department.trim() || null : null;

  let user, token;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName,
          email: normalizedEmail,
          passwordHash,
          institutionId: institution.id,
          department: trimmedDepartment,
        },
      });

      const createdToken = await tx.emailVerificationToken.create({
        data: {
          userId: createdUser.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        },
      });

      return { createdUser, createdToken };
    });

    user = result.createdUser;
    token = result.createdToken;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }
    throw err;
  }

  // Send verification email
  try {
    await sendVerificationEmail({ to: normalizedEmail, token: token.token });
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return NextResponse.json(
      {
        success: true,
        message: "Account created, but we couldn't send the verification email. Please use 'resend verification' to try again.",
        emailFailed: true,
      },
      { status: 201 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Account created. Please check your email to verify your account." },
    { status: 201 }
  );
}