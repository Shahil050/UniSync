import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid message ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const result = await prisma.message.updateMany({
    where: { id, senderId: userId, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  if (result.count === 0) {
    const exists = await prisma.message.findUnique({ where: { id }, select: { deletedAt: true, senderId: true } });
    if (!exists || exists.deletedAt) {
      return NextResponse.json({ success: false, message: "Message not found." }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: "You can only delete your own messages." }, { status: 403 });
  }

  return NextResponse.json({ success: true, message: "Message deleted." });
});