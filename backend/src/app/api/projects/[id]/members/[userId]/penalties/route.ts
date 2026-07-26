import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";
import { PenaltySeverity } from "@/generated/prisma/client";

const VALID_SEVERITIES = ["MINOR", "MAJOR"];

export const POST = auth(async function POST(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId, userId: targetUserId } = await params;
  if (!isValidUuid(projectId) || !isValidUuid(targetUserId)) {
    return NextResponse.json({ success: false, message: "Invalid ID." }, { status: 400 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { reason, severity } = body;
  if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
    return NextResponse.json({ success: false, message: "reason is required." }, { status: 400 });
  }

  let sev: PenaltySeverity = "MINOR";
  if (severity !== undefined) {
    const upper = String(severity).toUpperCase();
    if (!VALID_SEVERITIES.includes(upper)) {
      return NextResponse.json(
        { success: false, message: `severity must be one of: ${VALID_SEVERITIES.join(", ")}` },
        { status: 400 }
      );
    }
    sev = upper as PenaltySeverity;
  }

  const ownerId = req.auth.user.id;

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    select: { ownerId: true, status: true },
  });
  if (!project) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }
  if (project.ownerId !== ownerId) {
    return NextResponse.json({ success: false, message: "Only the project owner can issue penalty tags." }, { status: 403 });
  }
  if (project.status !== "COMPLETED") {
    return NextResponse.json(
      { success: false, message: "Penalty tags can only be issued once the project is marked COMPLETED." },
      { status: 409 }
    );
  }

  if (targetUserId === ownerId) {
    return NextResponse.json({ success: false, message: "Owners can't issue a penalty to themselves." }, { status: 400 });
  }

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: targetUserId } },
  });
  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json({ success: false, message: "This user is not an active member of this project." }, { status: 400 });
  }

  const penalty = await prisma.penaltyTag.create({
    data: { userId: targetUserId, projectId, reason: reason.trim(), severity: sev },
  });

  return NextResponse.json({ success: true, penalty }, { status: 201 });
});