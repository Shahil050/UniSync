// src/app/api/projects/[id]/members/[userId]/badges/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";
import { Prisma } from "@/generated/prisma/client";
import { notify } from "@/lib/notify";

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

  const { badgeId } = body;
  if (!badgeId || !isValidUuid(badgeId)) {
    return NextResponse.json({ success: false, message: "Valid badgeId is required." }, { status: 400 });
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
    return NextResponse.json({ success: false, message: "Only the project owner can award badges." }, { status: 403 });
  }
  if (project.status !== "COMPLETED") {
    return NextResponse.json(
      { success: false, message: "Badges can only be awarded once the project is marked COMPLETED." },
      { status: 409 }
    );
  }

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: targetUserId } },
  });
  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json({ success: false, message: "This user is not an active member of this project." }, { status: 400 });
  }

  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
  if (!badge) {
    return NextResponse.json({ success: false, message: "Badge not found." }, { status: 404 });
  }

  try {
    const awarded = await prisma.userBadge.create({
      data: { userId: targetUserId, badgeId, projectId },
    });
    const badge = await prisma.badge.findUnique({ where: { id: badgeId }, select: { name: true } });
    await notify(prisma, {
      userId: targetUserId,
      type: "BADGE_AWARDED",
      message: `You were awarded the "${badge?.name}" badge.`,
      projectId,
    });
    return NextResponse.json({ success: true, badge: awarded }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ success: false, message: "This badge was already awarded on this project." }, { status: 409 });
    }
    throw err;
  }
});