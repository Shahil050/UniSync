import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export const GET = requireAdmin(async function GET(req: any) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");
  const cursor = searchParams.get("cursor");
  const take = 24;

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { authors: { contains: search, mode: "insensitive" } },
    ];
  }

  const papers = await prisma.paper.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      title: true,
      authors: true,
      url: true,
      createdAt: true,
      addedBy: { select: { id: true, fullName: true } },
    },
  });

  return NextResponse.json({
    success: true,
    papers: papers.map((p) => ({
      id: p.id,
      title: p.title,
      authors: p.authors,
      url: p.url,
      addedBy: p.addedBy.fullName,
      createdAt: p.createdAt,
    })),
  });
});