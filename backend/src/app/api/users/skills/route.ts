import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerUserEmbedding, EMBEDDING_MODEL_VERSION } from "@/lib/ai-service";

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
        select: { id: true, name: true },
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

    const skillNames = found.map((s) => s.name); // `found` already exists earlier in this route — it's the validated Skill rows
    registerUserEmbedding(session.user.id, skillNames).catch((err) => {
        console.error("register_user failed:", err);
    });

    await prisma.user.update({
        where: { id: session.user.id },
        data: { skillsUpdatedAt: new Date() },
    });

    let embeddingSynced = true;
    try {
        await registerUserEmbedding(session.user.id, skillNames);
        await prisma.userEmbedding.upsert({
            where: { userId: session.user.id },
            create: { userId: session.user.id, vectorId: session.user.id, modelVersion: EMBEDDING_MODEL_VERSION },
            update: { vectorId: session.user.id, modelVersion: EMBEDDING_MODEL_VERSION },
        });
    } catch (err) {
        console.error("registerUserEmbedding failed:", err);
        embeddingSynced = false;
    }

    return NextResponse.json({ success: true, embeddingSynced });

});