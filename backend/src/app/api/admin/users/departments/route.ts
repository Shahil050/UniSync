import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prismaRaw } from "@/lib/prisma";

export const GET = requireAdmin(async function GET() {
  const rows = await prismaRaw.user.findMany({
    where: { department: { not: null } },
    distinct: ["department"],
    select: { department: true },
    orderBy: { department: "asc" },
  });

  const departments = rows.map((r) => r.department).filter(Boolean) as string[];

  return NextResponse.json({ success: true, departments });
});