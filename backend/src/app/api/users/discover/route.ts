import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSimilarUsers, AiServiceError, registerUserEmbedding, EMBEDDING_MODEL_VERSION } from "@/lib/ai-service";
import { isValidUuid } from "@/lib/validate-uuid";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = req.auth.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { skillsUpdatedAt: true, embedding: true, skills: { select: { skill: { select: { name: true } } } } },
  });

  const needsSync =
    !user?.embedding ||
    (user.skillsUpdatedAt && user.embedding.updatedAt < user.skillsUpdatedAt);

  if (needsSync && user?.skills.length) {
    try {
      await registerUserEmbedding(userId, user.skills.map((s) => s.skill.name));
      await prisma.userEmbedding.upsert({
        where: { userId },
        create: { userId, vectorId: userId, modelVersion: EMBEDDING_MODEL_VERSION },
        update: { vectorId: userId, modelVersion: EMBEDDING_MODEL_VERSION },
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Peer recommendation service is currently unavailable." },
        { status: 502 }
      );
    }
  }

  let matches: { user_id: string; similarity_score: number }[];
  try {
    matches = await getSimilarUsers(userId);
  } catch (err) {
    if (err instanceof AiServiceError) {
      return NextResponse.json(
        { success: false, message: "Peer recommendation service is currently unavailable." },
        { status: 502 }
      );
    }
    throw err;
  }

  matches = matches.filter((m) => isValidUuid(m.user_id));

  if (matches.length === 0) {
    return NextResponse.json({ success: true, users: [] });
  }

  const ids = matches.map((m) => m.user_id);
  const users = await prisma.user.findMany({
    where: { id: { in: ids }, deletedAt: null },
    select: { id: true, fullName: true, department: true, profileImage: true, bio: true, githubUrl: true, linkedinUrl: true },
  });

  const byId = new Map(users.map((u) => [u.id, u]));
  // preserve AI service's similarity ranking, and carry the score through
  const ordered = matches
    .map((m) => {
      const user = byId.get(m.user_id);
      return user ? { ...user, similarityScore: m.similarity_score } : null;
    })
    .filter(Boolean);

  return NextResponse.json({ success: true, users: ordered });
});