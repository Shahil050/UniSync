import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { projectId, recipientId, content } = body;
  const senderId = req.auth.user.id;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ success: false, message: "content is required." }, { status: 400 });
  }

  if (!!projectId === !!recipientId) {
    // both set, or neither set
    return NextResponse.json(
      { success: false, message: "Provide exactly one of projectId or recipientId." },
      { status: 400 }
    );
  }

  if (projectId) {
    if (!isValidUuid(projectId)) {
      return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true },
    });
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
    }

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: senderId } },
    });
    if (!membership || membership.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Only active members can post in this project." },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: { projectId, senderId, content: content.trim() },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  }

  // DM branch
  if (!isValidUuid(recipientId)) {
    return NextResponse.json({ success: false, message: "Invalid recipient ID." }, { status: 400 });
  }

  if (recipientId === senderId) {
    return NextResponse.json({ success: false, message: "You can't message yourself." }, { status: 400 });
  }

  const recipient = await prisma.user.findFirst({
    where: { id: recipientId, deletedAt: null },
    select: { id: true },
  });
  if (!recipient) {
    return NextResponse.json({ success: false, message: "Recipient not found." }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: { recipientId, senderId, content: content.trim() },
  });

  return NextResponse.json({ success: true, message }, { status: 201 });
});