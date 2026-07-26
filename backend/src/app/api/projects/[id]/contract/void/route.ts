// src/app/api/projects/[id]/contract/void/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const POST = auth(async function POST(req, { params }) {
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
    if (!project) return { status: 404 as const, message: "Project not found." };
    if (project.ownerId !== userId) {
      return { status: 403 as const, message: "Only the project owner can void the contract." };
    }

    const contract = await tx.contract.findUnique({
      where: { projectId },
      include: {
        roles: true,
        signatures: true,
      },
    });
    if (!contract) return { status: 404 as const, message: "Contract not found." };

    if (contract.status !== "ACTIVE") {
      return { status: 409 as const, message: "Only an active contract can be voided." };
    }

    // Snapshot before wiping — this is the only history that survives.
    await tx.projectAuditLog.create({
      data: {
        projectId,
        userId,
        action: "UPDATE",
        changes: {
          entity: "contract",
          voided: {
            content: contract.content,
            roles: contract.roles,
            signatures: contract.signatures,
            finalizedAt: contract.finalizedAt,
          },
        },
      },
    });

    await tx.contractSignature.deleteMany({ where: { contractId: contract.id } });
    await tx.contractRole.deleteMany({ where: { contractId: contract.id } });

    // Re-seed owner's role fresh, same as project creation — everyone re-signs from scratch.
    await tx.contractRole.create({
      data: {
        contractId: contract.id,
        userId: project.ownerId,
        roleTitle: "Project Owner",
        responsibilities: "Overall project direction and coordination.",
      },
    });

    // Re-add current active members as fresh roles too, so redrafting doesn't
    // silently drop anyone who was already part of the team.
    const activeMembers = await tx.projectMember.findMany({
      where: { projectId, status: "ACTIVE", userId: { not: project.ownerId } },
      select: { userId: true },
    });

    if (activeMembers.length > 0) {
      await tx.contractRole.createMany({
        data: activeMembers.map((m) => ({
          contractId: contract.id,
          userId: m.userId,
          roleTitle: "Contributor",
          responsibilities: "Contributes to project tasks as assigned by the team.",
        })),
      });
    }

    await tx.contract.update({
      where: { id: contract.id },
      data: { status: "DRAFT", finalizedAt: null },
    });

    return { status: 200 as const };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "Contract voided. All members must re-sign." });
});