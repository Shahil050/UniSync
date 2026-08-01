import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = req.auth.user.id;
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search");
  const department = searchParams.get("department");
  const skillCategory = searchParams.get("skillCategory");
  const cursor = searchParams.get("cursor");
  const take = 24;

  const where: any = { deletedAt: null, id: { not: userId }, role: "STUDENT" };
  if (search) where.fullName = { contains: search, mode: "insensitive" };
  if (department) where.department = department;
  if (skillCategory) {
    where.skills = { some: { skill: { category: skillCategory } } };
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { fullName: "asc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      fullName: true,
      department: true,
      profileImage: true,
      bio: true,
      githubUrl: true,
      linkedinUrl: true,
      skills: {
        select: { skill: { select: { name: true, category: true } } },
      },
    },
  });

  return NextResponse.json({ success: true, users });
});