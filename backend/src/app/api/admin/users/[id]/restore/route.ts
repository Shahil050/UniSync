import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prismaRaw } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const POST = requireAdmin(async function POST(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid user ID." }, { status: 400 });
  }

  const existing = await prismaRaw.user.findUnique({ where: { id }, select: { deletedAt: true } });
  if (!existing) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }
  if (!existing.deletedAt) {
    return NextResponse.json({ success: false, message: "User is already active." }, { status: 400 });
  }

  // Must go through prismaRaw.update — the extended client's delete()/deleteMany()
  // only ever sets deletedAt, and update() on the extended client isn't overridden,
  // so this is the correct place to clear it back to null.
  await prismaRaw.user.update({ where: { id }, data: { deletedAt: null } });

  return NextResponse.json({ success: true, message: "User reactivated." });
});