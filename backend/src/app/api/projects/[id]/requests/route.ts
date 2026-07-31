import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { notify } from "@/lib/notify";

export const POST = auth(async function POST(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { status: true, ownerId: true, title: true },
    });

    if (!project) {
      return { status: 404 as const, message: "Project not found." };
    }

    if (project.ownerId === userId) {
      return { status: 400 as const, message: "You already own this project." };
    }

    if (project.status !== "OPEN") {
      return { status: 409 as const, message: "This project isn't open for new members." };
    }

    const existing = await tx.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (existing) {
      if (existing.status === "PENDING") {
        return { status: 409 as const, message: "You already have a pending request for this project." };
      }
      if (existing.status === "ACTIVE") {
        return { status: 409 as const, message: "You're already a member of this project." };
      }
      // LEFT, REMOVED, or REJECTED — allow a fresh request by reusing the row
      await tx.projectMember.update({
        where: { projectId_userId: { projectId, userId } },
        data: { status: "PENDING", role: "CONTRIBUTOR", leftAt: null },
      });
    } else {
      await tx.projectMember.create({
        data: { projectId, userId, role: "CONTRIBUTOR", status: "PENDING" },
      });
    }

    await tx.projectAuditLog.create({
      data: {
        projectId,
        userId,
        action: "STATUS_CHANGE",
        changes: { entity: "member", to: "PENDING", userId },
      },
    });

    const requester = await tx.user.findUnique({ where: { id: userId }, select: { fullName: true } });
    await notify(tx, {
      userId: project.ownerId,
      type: "MEMBERSHIP_REQUEST",
      message: `${requester?.fullName ?? "Someone"} requested to join "${project.title}".`,
      projectId,
    });

    return { status: 201 as const };
  });

  if (outcome.status !== 201) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "Request sent." }, { status: 201 });
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

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    select: { ownerId: true },
  });

  if (!project) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return NextResponse.json(
      { success: false, message: "Only the project owner can view pending requests." },
      { status: 403 }
    );
  }

  const requests = await prisma.projectMember.findMany({
    where: { projectId, status: "PENDING" },
    select: {
      userId: true,
      joinedAt: true,
      user: { select: { id: true, fullName: true, profileImage: true } },
    },
    orderBy: { joinedAt: "asc" },
  });

  return NextResponse.json({ success: true, requests });
});