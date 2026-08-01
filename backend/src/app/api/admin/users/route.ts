import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/require-admin";
import { prisma, prismaRaw } from "@/lib/prisma";

const VALID_ROLES = ["STUDENT", "ADMIN"];

export const GET = requireAdmin(async function GET(req: any) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");
  const department = searchParams.get("department");
  const role = searchParams.get("role");
  const status = searchParams.get("status"); // "active" | "inactive"
  const cursor = searchParams.get("cursor");
  const take = 24;

  if (role && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ success: false, message: "Invalid role." }, { status: 400 });
  }
  if (status && !["active", "inactive"].includes(status)) {
    return NextResponse.json({ success: false, message: "Invalid status." }, { status: 400 });
  }

  const where: any = {};
  if (status === "active") where.deletedAt = null;
  if (status === "inactive") where.deletedAt = { not: null };
  if (role) where.role = role;
  if (department) where.department = department;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prismaRaw.user.findMany({
    where,
    orderBy: { fullName: "asc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      fullName: true,
      email: true,
      department: true,
      role: true,
      deletedAt: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    users: users.map((u) => ({
      id: u.id,
      name: u.fullName,
      email: u.email,
      department: u.department,
      role: u.role,
      status: u.deletedAt ? "Inactive" : "Active",
      emailVerified: !!u.emailVerified,
      createdAt: u.createdAt,
    })),
  });
});

export const POST = requireAdmin(async function POST(req: any) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const { fullName, email, password, department, role } = body;

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { success: false, message: "fullName, email and password are required." },
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
    return NextResponse.json({ success: false, message: "Invalid email format." }, { status: 400 });
  }
  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ success: false, message: "Invalid role." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ success: false, message: "Email already in use." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Admin-created accounts skip the Pokhara-domain gate and are pre-verified —
  // the admin is vouching for the account directly, no email confirmation loop.
  const user = await prisma.user.create({
    data: {
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      department: typeof department === "string" ? department.trim() || null : null,
      role: role ?? "STUDENT",
      emailVerified: new Date(),
    },
    select: { id: true, fullName: true, email: true, department: true, role: true },
  });

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.fullName,
      email: user.email,
      department: user.department,
      role: user.role,
      status: "Active",
    },
  });
});