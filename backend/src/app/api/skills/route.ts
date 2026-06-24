import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TagType } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
    const typeParam = req.nextUrl.searchParams.get("type");

    const where = typeParam
        ? { type: typeParam.toUpperCase() as TagType }
        : {};
    
    const skills = await prisma.skill.findMany({
        where,
        orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ success: true, skills });
}