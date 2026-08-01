import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED", "ABANDONED"];

export const PATCH = requireAdmin(async function PATCH(req: any, { params }: any) {
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

  const adminId = req.auth.user.id;

  const updated = await prisma.$transaction(async (tx) => {
    const current = await tx.project.findFirst({
      where: { id, deletedAt: null },
      select: { status: true },
    });

    if (!current) return null;

    await tx.project.update({ where: { id }, data: { status } });

    await tx.projectAuditLog.create({
      data: {
        projectId: id,
        userId: adminId,
        action: "STATUS_CHANGE",
        changes: { from: current.status, to: status, byAdmin: true },
      },
    });

    return tx.project.findUnique({ where: { id } });
  });

  if (updated === null) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, project: updated });
});