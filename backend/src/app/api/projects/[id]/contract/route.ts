import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!membership || !["ACTIVE", "LEFT", "REMOVED"].includes(membership.status)) {
    return NextResponse.json({ success: false, message: "Access denied." }, { status: 403 });
  }

  const contract = await prisma.contract.findUnique({
    where: { projectId },
    include: {
      roles: {
        include: { user: { select: { id: true, fullName: true, profileImage: true } } },
      },
      signatures: {
        select: { userId: true, signedAt: true },
      },
    },
  });

  if (!contract) {
    return NextResponse.json({ success: false, message: "Contract not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, contract });
});

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { summary } = body;
  if (typeof summary !== "string" || summary.trim().length === 0) {
    return NextResponse.json({ success: false, message: "summary is required." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { ownerId: true },
    });
    if (!project) return { status: 404 as const, message: "Project not found." };
    if (project.ownerId !== userId) {
      return { status: 403 as const, message: "Only the project owner can edit the contract." };
    }

    const contract = await tx.contract.findUnique({
      where: { projectId },
      include: { _count: { select: { signatures: true } } },
    });
    if (!contract) return { status: 404 as const, message: "Contract not found." };

    if (contract._count.signatures > 0) {
      return {
        status: 409 as const,
        message: "Contract can't be edited once someone has signed. Void and redraft instead.",
      };
    }

    const updated = await tx.contract.update({
      where: { projectId },
      data: { content: { summary: summary.trim() } },
    });

    return { status: 200 as const, contract: updated };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, contract: outcome.contract });
});