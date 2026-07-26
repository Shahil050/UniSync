import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";
import { Prisma } from "@/generated/prisma/client";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id, deletedAt: null },
    include: {
      owner: { select: { id: true, fullName: true, profileImage: true } },
      members: {
        where: { status: "ACTIVE" },
        select: {
          userId: true,
          role: true,
          status: true,
          joinedAt: true,
          user: { select: { id: true, fullName: true, profileImage: true } },
        },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
});

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { title, description } = body;
  const data: any = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ success: false, message: "Title cannot be empty." }, { status: 400 });
    }
    data.title = title.trim();
  }

  if (description !== undefined) {
    data.description = typeof description === "string" ? description.trim() || null : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided to update." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  // Atomic: ownership check + update + audit log all commit together,
  // or none of them do.
  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.project.updateMany({
      where: { id, ownerId: userId, deletedAt: null },
      data,
    });

    if (result.count === 0) {
      return null; // signal to the outer scope — can't return early from inside a transaction cleanly
    }

    await tx.projectAuditLog.create({
      data: {
        projectId: id,
        userId,
        action: "UPDATE",
        changes: data,
      },
    });

    return tx.project.findUnique({ where: { id } });
  });

  if (updated === null) {
    // Either the project doesn't exist, is deleted, or the caller isn't the owner —
    // fetch outside the transaction to distinguish which, for a correct error message
    const exists = await prisma.project.findUnique({ where: { id }, select: { deletedAt: true } });
    if (!exists || exists.deletedAt) {
      return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, message: "Only the project owner can edit this project." },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, project: updated });
});

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const outcome = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id, deletedAt: null },
      select: {
        ownerId: true,
        contract: { select: { status: true } },
      },
    });

    if (!project) {
      return { status: 404 as const, message: "Project not found." };
    }

    if (project.ownerId !== userId) {
      return { status: 403 as const, message: "Only the project owner can delete this project." };
    }

    if (project.contract && (project.contract.status === "ACTIVE" || project.contract.status === "COMPLETED")) {
      return {
        status: 409 as const,
        message: `Cannot delete a project with a ${project.contract.status.toLowerCase()} contract.`,
      };
    }

    // Ownership-scoped write kept as defense-in-depth even though we already
    // checked above — guards against the row changing between the read and here.
    const result = await tx.project.updateMany({
      where: { id, ownerId: userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      return { status: 404 as const, message: "Project not found." };
    }

    await tx.projectAuditLog.create({
      data: {
        projectId: id,
        userId,
        action: "DELETE",
        changes: Prisma.DbNull,
      },
    });

    return { status: 200 as const };
  });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "Project deleted." });
});