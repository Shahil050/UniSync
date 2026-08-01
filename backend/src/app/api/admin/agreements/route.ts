import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prismaRaw } from "@/lib/prisma";

const VALID_STATUSES = ["DRAFT", "ACTIVE", "COMPLETED", "BREACHED"];

export const GET = requireAdmin(async function GET(req: any) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const cursor = searchParams.get("cursor");
  const take = 24;

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ success: false, message: "Invalid status." }, { status: 400 });
  }

  const where: any = { deletedAt: null };
  if (status) where.status = status;
  if (search) where.project = { title: { contains: search, mode: "insensitive" } };

  const contracts = await prismaRaw.contract.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      status: true,
      createdAt: true,
      dueDate: true,
      project: { select: { id: true, title: true } },
      roles: { select: { userId: true } },
      signatures: { select: { userId: true } },
    },
  });

  return NextResponse.json({
    success: true,
    agreements: contracts.map((c) => ({
      id: c.id,
      projectId: c.project.id,
      project: c.project.title,
      status: c.status,
      totalMembers: c.roles.length,
      signed: c.signatures.length,
      dueDate: c.dueDate,
      createdAt: c.createdAt,
    })),
  });
});