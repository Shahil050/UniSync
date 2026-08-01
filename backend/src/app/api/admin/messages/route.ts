import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma, prismaRaw } from "@/lib/prisma";

export const GET = requireAdmin(async function GET(req: any) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");
  const date = searchParams.get("date"); // YYYY-MM-DD
  const type = searchParams.get("type"); // "project" | "direct"
  const includeDeleted = searchParams.get("includeDeleted") === "true";
  const cursor = searchParams.get("cursor");
  const take = 30;

  const where: any = {};
  if (type === "project") where.projectId = { not: null };
  if (type === "direct") where.recipientId = { not: null };

  if (date) {
    const start = new Date(date);
    if (isNaN(start.getTime())) {
      return NextResponse.json({ success: false, message: "Invalid date." }, { status: 400 });
    }
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    where.createdAt = { gte: start, lt: end };
  }

  if (search) {
    where.OR = [
      { content: { contains: search, mode: "insensitive" } },
      { sender: { fullName: { contains: search, mode: "insensitive" } } },
      { recipient: { fullName: { contains: search, mode: "insensitive" } } },
    ];
  }

  const messages = includeDeleted
    ? await prismaRaw.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          content: true,
          createdAt: true,
          deletedAt: true,
          sender: { select: { id: true, fullName: true } },
          recipient: { select: { id: true, fullName: true } },
          project: { select: { id: true, title: true } },
        },
      })
    : await prisma.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          content: true,
          createdAt: true,
          deletedAt: true,
          sender: { select: { id: true, fullName: true } },
          recipient: { select: { id: true, fullName: true } },
          project: { select: { id: true, title: true } },
        },
      });

  return NextResponse.json({
    success: true,
    messages: messages.map((m) => ({
      id: m.id,
      sender: m.sender.fullName,
      receiver: m.recipient ? m.recipient.fullName : `Project: ${m.project?.title ?? "Unknown"}`,
      type: m.recipient ? "Direct" : "Project",
      content: m.content,
      createdAt: m.createdAt,
      deleted: !!m.deletedAt,
    })),
  });
});