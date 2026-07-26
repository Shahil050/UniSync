import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { ownerId: true },
    });

    if (!project) {
      return { status: 404 as const, message: "Project not found." };
    }

    if (project.ownerId === userId) {
      return {
        status: 409 as const,
        message: "Owners can't leave their own project. Transfer ownership or delete the project instead.",
      };
    }

    const member = await tx.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member || member.status !== "ACTIVE") {
      return { status: 404 as const, message: "You're not an active member of this project." };
    }

    await tx.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { status: "LEFT", leftAt: new Date() },
    });

    await tx.projectAuditLog.create({
      data: {
        projectId,
        userId,
        action: "STATUS_CHANGE",
        changes: { entity: "member", from: "ACTIVE", to: "LEFT", userId },
      },
    });

    return { status: 200 as const };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "You've left the project." });
});