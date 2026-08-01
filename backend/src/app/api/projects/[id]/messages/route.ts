import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { serializeMessage } from "@/lib/serialize-message";

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

  const everJoined = membership && ["ACTIVE", "LEFT", "REMOVED"].includes(membership.status);
  if (!everJoined) {
    return NextResponse.json(
      { success: false, message: "You don't have access to this project's messages." },
      { status: 403 }
    );
  }

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor"); // message id to paginate before
  const take = 50;

  const messages = await prisma.message.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      sender: { select: { id: true, fullName: true, profileImage: true } },
    },
  });

  return NextResponse.json({ success: true, messages: messages.map(serializeMessage) });
});