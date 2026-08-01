import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { voidContract } from "@/lib/void-contract";

export const POST = auth(async function POST(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    select: { ownerId: true },
  });
  if (!project) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }
  if (project.ownerId !== userId) {
    return NextResponse.json(
      { success: false, message: "Only the project owner can void the contract." },
      { status: 403 }
    );
  }

  const outcome = await voidContract(projectId, userId);

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "Contract voided. All members must re-sign." });
});