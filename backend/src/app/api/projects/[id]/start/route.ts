import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { notify } from "@/lib/notify";

// src/app/api/projects/[id]/start/route.ts
//
// Officially starts a project. Only the owner can do this, and only while the
// project is still OPEN. Starting:
//   1. Moves the project to IN_PROGRESS and stamps startedAt.
//   2. Unlocks the collaboration agreement for members to view/sign — the
//      contract GET route only shows it to non-owners once the project has
//      started (see contract/route.ts).
//   3. Notifies every active member that the agreement is ready to be signed.
export const POST = auth(async function POST(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const ownerId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { ownerId: true, status: true, title: true },
    });

    if (!project) {
      return { status: 404 as const, message: "Project not found." };
    }

    if (project.ownerId !== ownerId) {
      return { status: 403 as const, message: "Only the project owner can start this project." };
    }

    if (project.status !== "OPEN") {
      return {
        status: 409 as const,
        message: project.status === "IN_PROGRESS"
          ? "This project has already been started."
          : `This project is ${project.status.toLowerCase()} and can't be started.`,
      };
    }

    const contract = await tx.contract.findUnique({
      where: { projectId },
      select: { id: true },
    });
    if (!contract) {
      return { status: 409 as const, message: "This project has no agreement to activate yet." };
    }

    const startedAt = new Date();
    await tx.project.update({
      where: { id: projectId },
      data: { status: "IN_PROGRESS", startedAt },
    });

    await tx.projectAuditLog.create({
      data: {
        projectId,
        userId: ownerId,
        action: "STATUS_CHANGE",
        changes: { from: "OPEN", to: "IN_PROGRESS", reason: "project_started" },
      },
    });

    const activeMembers = await tx.projectMember.findMany({
      where: { projectId, status: "ACTIVE", userId: { not: ownerId } },
      select: { userId: true },
    });

    for (const m of activeMembers) {
      await notify(tx, {
        userId: m.userId,
        type: "PROJECT_STARTED",
        message: `"${project.title}" has officially started. Review and sign the collaboration agreement.`,
        projectId,
      });
    }

    return { status: 200 as const, startedAt };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({
    success: true,
    message: "Project started. The agreement is now visible to members.",
    startedAt: outcome.startedAt,
  });
});
