import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";
import { ResourceType } from "@/generated/prisma/enums";

const VALID_TYPES = ["DOCUMENT", "PAPER", "LINK", "IMAGE"];

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

  const { title, type, url } = body;
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ success: false, message: "title is required." }, { status: 400 });
  }
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    return NextResponse.json({ success: false, message: "url is required." }, { status: 400 });
  }
  
  const upperType = typeof type === "string" ? type.toUpperCase() : "LINK";
  if (!VALID_TYPES.includes(upperType)) {
    return NextResponse.json({ success: false, message: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
  }
  const resType = upperType as ResourceType;

  const userId = req.auth.user.id;
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json({ success: false, message: "Only active members can add resources." }, { status: 403 });
  }

  const normalizedUrl = /^https?:\/\//.test(url.trim()) ? url.trim() : `https://${url.trim()}`;

  const resource = await prisma.projectResource.create({
    data: { projectId, title: title.trim(), type: resType, url: normalizedUrl, addedById: userId },
  });

  return NextResponse.json({ success: true, resource }, { status: 201 });
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

  const resources = await prisma.projectResource.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { addedBy: { select: { id: true, fullName: true } } },
  });

  return NextResponse.json({ success: true, resources });
});