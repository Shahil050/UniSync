import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { getPaperRecommendations, AiServiceError } from "@/lib/ai-service";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json({ success: false, message: "Access denied." }, { status: 403 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    select: { title: true, description: true },
  });
  if (!project) {
    return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
  }

  // Build the search string from the project itself
  const query = [project.title, project.description].filter(Boolean).join(" ").trim();
  if (!query) {
    return NextResponse.json({ success: true, papers: [] });
  }

  let recommendedIds: string[];
  try {
    const result = await getPaperRecommendations(query);
    recommendedIds = result.recommended_postgres_ids;
  } catch (err) {
    if (err instanceof AiServiceError) {
      return NextResponse.json(
        { success: false, message: "Paper recommendation service is currently unavailable." },
        { status: 502 }
      );
    }
    throw err;
  }

  if (recommendedIds.length === 0) {
    return NextResponse.json({ success: true, papers: [] });
  }

  // Fetch the actual paper records, preserving the AI service's relevance order
  const papers = await prisma.paper.findMany({
    where: { id: { in: recommendedIds } },
  });
  const byId = new Map(papers.map((p) => [p.id, p]));
  const ordered = recommendedIds.map((id) => byId.get(id)).filter(Boolean);

  return NextResponse.json({ success: true, papers: ordered });
});