import { prisma } from "./prisma";

type VoidOutcome =
  | { status: 200 }
  | { status: 404; message: string }
  | { status: 409; message: string };

export async function voidContract(
  projectId: string,
  actingUserId: string,
  opts: { byAdmin?: boolean } = {}
): Promise<VoidOutcome> {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { ownerId: true },
    });
    if (!project) return { status: 404 as const, message: "Project not found." };

    const contract = await tx.contract.findUnique({
      where: { projectId },
      include: { roles: true, signatures: true },
    });
    if (!contract) return { status: 404 as const, message: "Contract not found." };

    if (contract.status !== "ACTIVE") {
      return { status: 409 as const, message: "Only an active contract can be voided." };
    }

    // Snapshot before wiping — this is the only history that survives.
    await tx.projectAuditLog.create({
      data: {
        projectId,
        userId: actingUserId,
        action: "UPDATE",
        changes: {
          entity: "contract",
          byAdmin: !!opts.byAdmin,
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

    // Re-add current active members as fresh roles too, so redrafting doesn't silently drop anyone who was already part of the team.
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
}