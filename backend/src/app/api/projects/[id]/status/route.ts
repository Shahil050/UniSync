// src/app/api/projects/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED", "ABANDONED"];

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { status } = body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { success: false, message: `Status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const userId = req.auth.user.id;

  const updated = await prisma.$transaction(async (tx) => {
    // Fetch current status first so the audit log can record from → to.
    // Scoped by ownerId here too, so we don't leak status to a non-owner
    // via this read before the ownership-checked write even runs.
    const current = await tx.project.findFirst({
      where: { id, ownerId: userId, deletedAt: null },
      select: { status: true },
    });

    if (!current) {
      return null;
    }

    await tx.project.update({
      where: { id },
      data: { status },
    });

    await tx.projectAuditLog.create({
      data: {
        projectId: id,
        userId,
        action: "STATUS_CHANGE",
        changes: { from: current.status, to: status },
      },
    });

    return tx.project.findUnique({ where: { id } });
  });

  if (updated === null) {
    const exists = await prisma.project.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!exists || exists.deletedAt) {
      return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, message: "Only the project owner can change this project's status." },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, project: updated });
});