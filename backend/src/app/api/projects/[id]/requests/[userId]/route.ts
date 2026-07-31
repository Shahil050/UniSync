import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";
import { notify } from "@/lib/notify";

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId, userId: targetUserId } = await params;
  if (!isValidUuid(projectId) || !isValidUuid(targetUserId)) {
    return NextResponse.json({ success: false, message: "Invalid ID." }, { status: 400 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { decision } = body;
  if (decision !== "ACCEPT" && decision !== "REJECT") {
    return NextResponse.json(
      { success: false, message: "decision must be ACCEPT or REJECT." },
      { status: 400 }
    );
  }

  const ownerId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { ownerId: true },
    });

    if (!project) {
      return { status: 404 as const, message: "Project not found." };
    }

    if (project.ownerId !== ownerId) {
      return { status: 403 as const, message: "Only the project owner can act on requests." };
    }

    const member = await tx.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });

    if (!member || member.status !== "PENDING") {
      return { status: 404 as const, message: "No pending request found for this user." };
    }

    // only the accept branch changes; reject branch unchanged
    const newStatus = decision === "ACCEPT" ? "ACTIVE" : "REJECTED";

    await tx.projectMember.update({
    where: { projectId_userId: { projectId, userId: targetUserId } },
    data: {
        status: newStatus,
        ...(decision === "ACCEPT" ? { joinedAt: new Date() } : {}),
    },
    });

    const projectInfo = await tx.project.findUnique({ where: { id: projectId }, select: { title: true } });
    await notify(tx, {
      userId: targetUserId,
      type: decision === "ACCEPT" ? "MEMBERSHIP_ACCEPTED" : "MEMBERSHIP_REJECTED",
      message: decision === "ACCEPT"
        ? `Your request to join "${projectInfo?.title}" was accepted.`
        : `Your request to join "${projectInfo?.title}" was declined.`,
      projectId,
    });

    if (decision === "ACCEPT") {
    const contract = await tx.contract.findUnique({
        where: { projectId },
        select: { id: true },
    });

    if (contract) {
        // upsert in case this user had a role from a previous membership cycle
        await tx.contractRole.upsert({
        where: { contractId_userId: { contractId: contract.id, userId: targetUserId } },
        create: {
            contractId: contract.id,
            userId: targetUserId,
            roleTitle: "Contributor",
            responsibilities: "Contributes to project tasks as assigned by the team.",
        },
        update: {}, // role already exists, leave as-is
        });
    }
    }

    await tx.projectAuditLog.create({
      data: {
        projectId,
        userId: ownerId,
        action: "STATUS_CHANGE",
        changes: { entity: "member", from: "PENDING", to: newStatus, userId: targetUserId },
      },
    });

    return { status: 200 as const };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: `Request ${decision.toLowerCase()}ed.` });
});