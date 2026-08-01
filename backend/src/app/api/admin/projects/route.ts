import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prismaRaw } from "@/lib/prisma";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED", "ABANDONED"];

export const GET = requireAdmin(async function GET(req: any) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const archived = searchParams.get("archived"); // "active" | "inactive"
  const cursor = searchParams.get("cursor");
  const take = 24;

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ success: false, message: "Invalid status." }, { status: 400 });
  }
  if (archived && !["active", "inactive"].includes(archived)) {
    return NextResponse.json({ success: false, message: "Invalid archived value." }, { status: 400 });
  }

  const where: any = {};
  if (archived === "inactive") where.deletedAt = { not: null };
  else if (archived === "active" || !archived) where.deletedAt = null; // default: hide soft-deleted
  if (status) where.status = status;
  if (search) where.title = { contains: search, mode: "insensitive" };

  const projects = await prismaRaw.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      deletedAt: true,
      owner: { select: { id: true, fullName: true } },
      members: { where: { status: "ACTIVE" }, select: { id: true } },
    },
  });

  return NextResponse.json({
    success: true,
    projects: projects.map((p) => ({
      id: p.id,
      name: p.title,
      leader: p.owner.fullName,
      leaderId: p.owner.id,
      members: p.members.length,
      status: p.status,
      archived: !!p.deletedAt,
      createdAt: p.createdAt,
    })),
  });
});