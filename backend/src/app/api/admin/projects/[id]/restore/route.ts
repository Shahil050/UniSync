import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma, prismaRaw } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const POST = requireAdmin(async function POST(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const adminId = req.auth.user.id;

  const existing = await prismaRaw.project.findUnique({ where: { id }, select: { deletedAt: true } });
  if (!existing) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }
  if (!existing.deletedAt) {
    return NextResponse.json({ success: false, message: "Project is already active." }, { status: 400 });
  }

  // update() isn't touched by the soft-delete extension (it only intercepts
  // find*/delete*/count), so this can run through the normal `prisma` client
  // and stay inside a real transaction with the audit log write.
  await prisma.$transaction(async (tx) => {
    await tx.project.update({ where: { id }, data: { deletedAt: null } });
    await tx.projectAuditLog.create({
      data: { projectId: id, userId: adminId, action: "UPDATE", changes: { restored: true, byAdmin: true } as any },
    });
  });

  return NextResponse.json({ success: true, message: "Project reactivated." });
});