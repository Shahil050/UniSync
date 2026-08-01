import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const DELETE = requireAdmin(async function DELETE(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid message ID." }, { status: 400 });
  }

  const result = await prisma.message.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  if (result.count === 0) {
    return NextResponse.json({ success: false, message: "Message not found or already deleted." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Message removed." });
});