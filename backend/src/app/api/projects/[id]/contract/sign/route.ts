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
    const contract = await tx.contract.findUnique({
      where: { projectId },
      select: { id: true, status: true, dueDate: true },
    });
    if (!contract) return { status: 404 as const, message: "Contract not found." };

    if (contract.status === "COMPLETED" || contract.status === "BREACHED") {
      return { status: 409 as const, message: `Contract is ${contract.status.toLowerCase()}, can't sign.` };
    }

    if (!contract.dueDate) {
      return { status: 409 as const, message: "The project owner must set a deadline before this agreement can be signed." };
    }

    const role = await tx.contractRole.findUnique({
      where: { contractId_userId: { contractId: contract.id, userId } },
    });
    if (!role) {
      return { status: 403 as const, message: "You don't have a role on this contract." };
    }

    const existingSignature = await tx.contractSignature.findUnique({
      where: { contractId_userId: { contractId: contract.id, userId } },
    });
    if (existingSignature) {
      return { status: 409 as const, message: "You've already signed." };
    }

    await tx.contractSignature.create({
      data: { contractId: contract.id, userId },
    });

    let activated = false;
    if (contract.status === "DRAFT") {
      const [roleCount, signatureCount] = await Promise.all([
        tx.contractRole.count({ where: { contractId: contract.id } }),
        tx.contractSignature.count({ where: { contractId: contract.id } }),
      ]);
      if (roleCount === signatureCount) {
        await tx.contract.update({
          where: { id: contract.id },
          data: { status: "ACTIVE", finalizedAt: new Date() },
        });
        activated = true;
      }
    }

    return { status: 200 as const, activated, wasAlreadyActive: contract.status === "ACTIVE" };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  const message = outcome.activated
    ? "Signed. Contract is now active."
    : outcome.wasAlreadyActive
      ? "Signed."
      : "Signed. Waiting on other members.";

  return NextResponse.json({ success: true, message });
});