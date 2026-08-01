import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma, prismaRaw } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

const VALID_ROLES = ["STUDENT", "ADMIN"];

export const PATCH = requireAdmin(async function PATCH(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid user ID." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const { fullName, department, role } = body;
  const data: any = {};

  if (fullName !== undefined) {
    if (typeof fullName !== "string" || fullName.trim().length === 0) {
      return NextResponse.json({ success: false, message: "fullName cannot be empty." }, { status: 400 });
    }
    data.fullName = fullName.trim();
  }

  if (department !== undefined) {
    data.department = typeof department === "string" ? department.trim() || null : null;
  }

  if (role !== undefined) {
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role." }, { status: 400 });
    }
    if (id === req.auth.user.id && role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "You can't demote your own account." },
        { status: 400 }
      );
    }
    data.role = role;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided to update." }, { status: 400 });
  }

  const result = await prisma.user.updateMany({ where: { id }, data });
  if (result.count === 0) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }

  const updated = await prismaRaw.user.findUnique({
    where: { id },
    select: { id: true, fullName: true, email: true, department: true, role: true, deletedAt: true },
  });

  return NextResponse.json({
    success: true,
    user: {
      id: updated!.id,
      name: updated!.fullName,
      email: updated!.email,
      department: updated!.department,
      role: updated!.role,
      status: updated!.deletedAt ? "Inactive" : "Active",
    },
  });
});

// Deactivate (soft delete) — same convention as Projects: DELETE means soft delete.
export const DELETE = requireAdmin(async function DELETE(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid user ID." }, { status: 400 });
  }

  if (id === req.auth.user.id) {
    return NextResponse.json(
      { success: false, message: "You can't deactivate your own account." },
      { status: 400 }
    );
  }

  const existing = await prismaRaw.user.findUnique({ where: { id }, select: { deletedAt: true } });
  if (!existing) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }
  if (existing.deletedAt) {
    return NextResponse.json({ success: false, message: "User is already inactive." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } }); // soft delete via prisma.ts extension

  return NextResponse.json({ success: true, message: "User deactivated." });
});