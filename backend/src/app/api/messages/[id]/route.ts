import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { deleteMessageFile } from "@/lib/message-storage";

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid message ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    return NextResponse.json({ success: false, message: "Message not found." }, { status: 404 });
  }
  if (existing.senderId !== userId) {
    return NextResponse.json({ success: false, message: "You can only delete your own messages." }, { status: 403 });
  }

  await prisma.message.update({ where: { id }, data: { deletedAt: new Date() } });
  await deleteMessageFile(existing.filePath);

  return NextResponse.json({ success: true, message: "Message deleted." });
});