import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { Prisma } from "@/generated/prisma/client";

export const DELETE = requireAdmin(async function DELETE(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const adminId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id, deletedAt: null },
      select: { contract: { select: { status: true } } },
    });

    if (!project) return { status: 404 as const, message: "Project not found." };

    // Same integrity guard as the owner-facing route — admin can override
    // ownership, but not silently orphan an active/completed contract.
    if (project.contract && (project.contract.status === "ACTIVE" || project.contract.status === "COMPLETED")) {
      return {
        status: 409 as const,
        message: `Cannot delete a project with a ${project.contract.status.toLowerCase()} contract.`,
      };
    }

    const result = await tx.project.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) return { status: 404 as const, message: "Project not found." };

    await tx.projectAuditLog.create({
      data: { projectId: id, userId: adminId, action: "DELETE", changes: { byAdmin: true } as any },
    });

    return { status: 200 as const };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "Project deactivated." });
});