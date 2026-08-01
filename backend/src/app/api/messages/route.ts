import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";
import { saveMessageFile } from "@/lib/message-storage";
import { serializeMessage } from "@/lib/serialize-message";
import { getSystemSettings } from "@/lib/settings";
import { ResourceType } from "@/generated/prisma/enums";

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const senderId = req.auth.user.id;

  let projectId: string | undefined;
  let recipientId: string | undefined;
  let content = "";
  let file: File | null = null;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json(
        { success: false, message: "Expected multipart/form-data." },
        { status: 400 }
      );
    }

    const pid = form.get("projectId");
    const rid = form.get("recipientId");
    const c = form.get("content");
    const f = form.get("file");

    projectId = typeof pid === "string" && pid ? pid : undefined;
    recipientId = typeof rid === "string" && rid ? rid : undefined;
    content = typeof c === "string" ? c : "";
    if (f instanceof File && f.size > 0) file = f;
  } else {
    const { data: body, error } = await parseJson(req);
    if (error) return error;

    projectId = body.projectId;
    recipientId = body.recipientId;
    content = typeof body.content === "string" ? body.content : "";
  }

  if (!content.trim() && !file) {
    return NextResponse.json(
      { success: false, message: "Message must include text or a file." },
      { status: 400 }
    );
  }

  if (!!projectId === !!recipientId) {
    return NextResponse.json(
      { success: false, message: "Provide exactly one of projectId or recipientId." },
      { status: 400 }
    );
  }

  if (file) {
    const { maxUploadSizeMB } = await getSystemSettings();
    if (file.size > maxUploadSizeMB * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: `File must be under ${maxUploadSizeMB}MB.` },
        { status: 400 }
      );
    }
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

    const final = file ? await attachFile(message.id, senderId, projectId, file) : message;
    return NextResponse.json({ success: true, message: serializeMessage(final) }, { status: 201 });
  }

  // DM branch
  if (!isValidUuid(recipientId!)) {
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

  const final = file ? await attachFile(message.id, senderId, undefined, file) : message;
  return NextResponse.json({ success: true, message: serializeMessage(final) }, { status: 201 });
});

async function attachFile(messageId: string, senderId: string, projectId: string | undefined, file: File) {
  const filePath = await saveMessageFile(messageId, file);
  const updated = await prisma.message.update({
    where: { id: messageId },
    data: {
      filePath,
      fileName: file.name,
      fileType: file.type || null,
      fileSize: file.size,
    },
  });

  // Group-chat attachments also show up in the project's Resources panel.
  if (projectId) {
    const resType: ResourceType = file.type?.startsWith("image/") ? "IMAGE" : "DOCUMENT";
    const fileUrl = `${process.env.NEXTAUTH_URL}/api/messages/${messageId}/file`;
    try {
      await prisma.projectResource.create({
        data: {
          projectId,
          title: file.name,
          type: resType,
          url: fileUrl,
          addedById: senderId,
        },
      });
    } catch {
      // Resource creation is best-effort — the message itself already succeeded.
    }
  }

  return updated;
}