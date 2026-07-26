import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED", "ABANDONED"];

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { title, description } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const userId = req.auth.user.id;
  const trimmedTitle = title.trim();
  const trimmedDescription = description?.trim() || null;

  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        title: trimmedTitle,
        description: trimmedDescription,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "OWNER",
            status: "ACTIVE",
          },
        },
        contract: {
          create: {
            status: "DRAFT",
            content: {
              summary: trimmedDescription ?? "",
            },
            roles: {
              create: {
                userId,
                roleTitle: "Project Owner",
                responsibilities: "Overall project direction and coordination.",
              },
            },
          },
        },
      },
      include: {
        members: true,
        contract: { include: { roles: true } },
      },
    });

    await tx.projectAuditLog.create({
      data: {
        projectId: created.id,
        userId,
        action: "CREATE",
        changes: { title: created.title, description: created.description },
      },
    });

    return created;
  });

  return NextResponse.json({ project }, { status: 201 });
});

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const mine = searchParams.get("mine") === "true";
  const userIdParam = searchParams.get("userId");
  const statusParam = searchParams.get("status");

  // Validate status up front, regardless of which branch uses it
  let status: string | undefined;
  if (statusParam) {
    const upper = statusParam.toUpperCase();
    if (!VALID_STATUSES.includes(upper)) {
      return NextResponse.json(
        { success: false, message: `Status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    status = upper;
  }

  const where: any = { deletedAt: null };

  if (mine) {
    const userId = req.auth.user.id;
    where.OR = [
      { ownerId: userId },
      { members: { some: { userId, status: "ACTIVE" } } },
    ];
    if (status) where.status = status; // now respected instead of silently dropped
  } else if (userIdParam) {
    const targetUser = await prisma.user.findUnique({
      where: { id: userIdParam, deletedAt: null },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    where.OR = [
      { ownerId: userIdParam },
      { members: { some: { userId: userIdParam, status: "ACTIVE" } } },
    ];
    if (status) where.status = status; // same here
  } else if (status) {
    where.status = status;
  } else {
    where.status = "OPEN"; // default discovery view
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      members: {
        select: { userId: true, role: true, status: true },
      },
    },
  });

  return NextResponse.json({ success: true, projects });
});

