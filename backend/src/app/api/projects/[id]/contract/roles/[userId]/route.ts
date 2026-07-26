// src/app/api/projects/[id]/contract/roles/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";

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

  const { roleTitle, responsibilities, expectedHours } = body;
  const data: any = {};

  if (roleTitle !== undefined) {
    if (typeof roleTitle !== "string" || roleTitle.trim().length === 0) {
      return NextResponse.json({ success: false, message: "roleTitle cannot be empty." }, { status: 400 });
    }
    data.roleTitle = roleTitle.trim();
  }

  if (responsibilities !== undefined) {
    data.responsibilities = typeof responsibilities === "string" ? responsibilities.trim() || null : null;
  }

  if (expectedHours !== undefined) {
    if (expectedHours !== null && (typeof expectedHours !== "number" || expectedHours < 0)) {
      return NextResponse.json({ success: false, message: "expectedHours must be a positive number or null." }, { status: 400 });
    }
    data.expectedHours = expectedHours;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided to update." }, { status: 400 });
  }

  const ownerId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { ownerId: true },
    });
    if (!project) return { status: 404 as const, message: "Project not found." };
    if (project.ownerId !== ownerId) {
      return { status: 403 as const, message: "Only the project owner can edit contract roles." };
    }

    const contract = await tx.contract.findUnique({
      where: { projectId },
      select: { id: true },
    });
    if (!contract) return { status: 404 as const, message: "Contract not found." };

    const role = await tx.contractRole.findUnique({
      where: { contractId_userId: { contractId: contract.id, userId: targetUserId } },
    });
    if (!role) return { status: 404 as const, message: "This user has no role on this contract." };

    const signature = await tx.contractSignature.findUnique({
      where: { contractId_userId: { contractId: contract.id, userId: targetUserId } },
    });
    if (signature) {
      return { status: 409 as const, message: "This person has already signed — their role is locked." };
    }

    const updated = await tx.contractRole.update({
      where: { contractId_userId: { contractId: contract.id, userId: targetUserId } },
      data,
    });

    return { status: 200 as const, role: updated };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, role: outcome.role });
});