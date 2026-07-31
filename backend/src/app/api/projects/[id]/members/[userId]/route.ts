// src/app/api/projects/[id]/members/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { notify } from "@/lib/notify";

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId, userId: targetUserId } = await params;
  if (!isValidUuid(projectId) || !isValidUuid(targetUserId)) {
    return NextResponse.json({ success: false, message: "Invalid ID." }, { status: 400 });
  }

  const ownerId = req.auth.user.id;

  if (targetUserId === ownerId) {
    return NextResponse.json(
      { success: false, message: "Owners can't remove themselves. Transfer ownership or delete the project instead." },
      { status: 409 }
    );
  }

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { ownerId: true },
    });

    if (!project) {
      return { status: 404 as const, message: "Project not found." };
    }

    if (project.ownerId !== ownerId) {
      return { status: 403 as const, message: "Only the project owner can remove members." };
    }

    const member = await tx.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });

    if (!member || member.status !== "ACTIVE") {
      return { status: 404 as const, message: "This user isn't an active member of this project." };
    }

    await tx.projectMember.update({
      where: { projectId_userId: { projectId, userId: targetUserId } },
      data: { status: "REMOVED", leftAt: new Date() },
    });

    const projectInfo = await tx.project.findUnique({ where: { id: projectId }, select: { title: true } });
    await notify(tx, {
      userId: targetUserId,
      type: "MEMBER_REMOVED",
      message: `You were removed from "${projectInfo?.title}".`,
      projectId,
    });

    await tx.projectAuditLog.create({
      data: {
        projectId,
        userId: ownerId,
        action: "STATUS_CHANGE",
        changes: { entity: "member", from: "ACTIVE", to: "REMOVED", userId: targetUserId },
      },
    });

    return { status: 200 as const };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "Member removed." });
});