import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";

const VALID_ACTIVITY_TYPES = ["COMMIT", "UPLOAD", "MESSAGE", "MILESTONE", "OTHER"];

export const POST = auth(async function POST(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { activityType, description, metadata } = body;
  if (!activityType || !VALID_ACTIVITY_TYPES.includes(activityType)) {
    return NextResponse.json(
      { success: false, message: `activityType must be one of: ${VALID_ACTIVITY_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  const userId = req.auth.user.id;

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json(
      { success: false, message: "Only active members can log activity." },
      { status: 403 }
    );
  }

  const entry = await prisma.activityLog.create({
    data: {
      projectId,
      userId,
      activityType,
      description: typeof description === "string" ? description.trim() || null : null,
      metadata: metadata ?? undefined,
    },
  });

  return NextResponse.json({ success: true, entry }, { status: 201 });
});

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
    return NextResponse.json({ success: false, message: "Access denied." }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const userIdFilter = searchParams.get("userId"); // optional: view one person's log only

  const entries = await prisma.activityLog.findMany({
    where: { projectId, ...(userIdFilter ? { userId: userIdFilter } : {}) },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, fullName: true, profileImage: true } } },
  });

  return NextResponse.json({ success: true, entries });
});