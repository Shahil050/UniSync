import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid user ID." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      fullName: true,
      department: true,
      batch: true,
      githubUrl: true,
      linkedinUrl: true,
      profileImage: true,
      bio: true,
      createdAt: true,
      institution: { select: { name: true } },
      skills: {
        select: {
          proficiency: true,
          skill: { select: { id: true, name: true, type: true, category: true } },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
});

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid user ID." }, { status: 400 });
  }

  if (id !== req.auth.user.id) {
    return NextResponse.json(
      { success: false, message: "You can only edit your own profile." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const { fullName, department, batch, githubUrl, linkedinUrl, profileImage, bio } = body;
  const data: any = {};

  if (fullName !== undefined) {
    if (typeof fullName !== "string" || fullName.trim().length === 0) {
      return NextResponse.json({ success: false, message: "fullName cannot be empty." }, { status: 400 });
    }
    data.fullName = fullName.trim();
  }

  if (department !== undefined) data.department = typeof department === "string" ? department.trim() || null : null;
  if (batch !== undefined) data.batch = typeof batch === "string" ? batch.trim() || null : null;
  if (bio !== undefined) data.bio = typeof bio === "string" ? bio.trim() || null : null;

  const urlFields = { githubUrl, linkedinUrl, profileImage };
  for (const [key, value] of Object.entries(urlFields)) {
    if (value === undefined) continue;
    if (value === null || value === "") {
      data[key] = null;
      continue;
    }
    if (typeof value !== "string" || !/^https?:\/\/.+/.test(value)) {
      return NextResponse.json({ success: false, message: `${key} must be a valid URL.` }, { status: 400 });
    }
    data[key] = value.trim();
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided to update." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      fullName: true,
      department: true,
      batch: true,
      githubUrl: true,
      linkedinUrl: true,
      profileImage: true,
      bio: true,
    },
  });

  return NextResponse.json({ success: true, user: updated });
});