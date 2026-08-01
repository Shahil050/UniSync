import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { readMessageFile } from "@/lib/message-storage";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid message ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message || message.deletedAt || !message.filePath) {
    return NextResponse.json({ success: false, message: "File not found." }, { status: 404 });
  }

  let allowed = message.senderId === userId || message.recipientId === userId;
  if (!allowed && message.projectId) {
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: message.projectId, userId } },
    });
    allowed = !!membership && ["ACTIVE", "LEFT", "REMOVED"].includes(membership.status);
  }
  if (!allowed) {
    return NextResponse.json({ success: false, message: "You don't have access to this file." }, { status: 403 });
  }

  let bytes: Buffer;
  try {
    bytes = await readMessageFile(message.filePath);
  } catch {
    return NextResponse.json({ success: false, message: "Stored file is missing." }, { status: 404 });
  }

  return new NextResponse(Uint8Array.from(bytes), {
    headers: {
      "Content-Type": message.fileType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${(message.fileName || "file").replace(/[^\w.-]/g, "_")}"`,
    },
  });
});