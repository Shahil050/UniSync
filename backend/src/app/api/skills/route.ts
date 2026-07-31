import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TagType } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
  const typeParam = req.nextUrl.searchParams.get("type");
  const search = req.nextUrl.searchParams.get("search");

  const where: any = {};
  if (typeParam) where.type = typeParam.toUpperCase();
  if (search) where.name = { contains: search, mode: "insensitive" };

  const skills = await prisma.skill.findMany({
    where,
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ success: true, skills });
}