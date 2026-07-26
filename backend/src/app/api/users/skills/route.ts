import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const POST = auth(async function POST(req) {
    const session = req.auth;

    if (!session?.user) {
        return NextResponse.json(
            { success: false, message: "Not authenticated." },
            { status: 401 }
        );
    }

    const { skills } = await req.json();
    
    if (!Array.isArray(skills) || skills.length === 0) {
        return NextResponse.json(
            {  success: false, message: "Skills must be a non-empty array." },
            { status: 400 }
        );
    }

    // Validate all skillIds exist
    const skillIds = skills.map((s: any) => s.skillId);
    const found = await prisma.skill.findMany({
        where: { id: { in: skillIds } },
        select: { id: true },
    });

    if (found.length !== skillIds.length) {
        return NextResponse.json(
            { success: false, message: "One or more skill IDs are invalid." },
            { status: 400 }
        );
    }

    // Upsert (Update + Insert) - safe to call again if user revisits the onboarding step
    await prisma.$transaction(
        skills.map((s: any) =>
            prisma.userSkill.upsert({
                where: {
                    userId_skillId: { userId: session.user.id, skillId: s.skillId },
                },
                create: {
                    userId: session.user.id,
                    skillId: s.skillId,
                    proficiency: s.proficiency ?? null,
                },
                update: {
                    proficiency: s.proficiency ?? null,
                },
            })
        )
    );

    return NextResponse.json({ success: true });
});