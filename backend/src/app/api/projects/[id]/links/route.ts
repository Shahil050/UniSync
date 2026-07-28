import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";
import { isValidUuid } from "@/lib/validate-uuid";

function normalizeUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const trimmed = value.trim();
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId } = await params;
  if (!isValidUuid(projectId)) {
    return NextResponse.json({ success: false, message: "Invalid project ID." }, { status: 400 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const userId = req.auth.user.id;
  const data: any = {};
  if ("githubUrl" in body) data.githubUrl = normalizeUrl(body.githubUrl);
  if ("boardUrl" in body) data.boardUrl = normalizeUrl(body.boardUrl);
  if ("docsUrl" in body) data.docsUrl = normalizeUrl(body.docsUrl);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided." }, { status: 400 });
  }

  const result = await prisma.project.updateMany({
    where: { id: projectId, ownerId: userId, deletedAt: null },
    data,
  });

  if (result.count === 0) {
    const exists = await prisma.project.findUnique({ where: { id: projectId }, select: { deletedAt: true } });
    if (!exists || exists.deletedAt) {
      return NextResponse.json({ success: false, message: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: "Only the project owner can edit these links." }, { status: 403 });
  }

  const updated = await prisma.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true, boardUrl: true, docsUrl: true },
  });

  return NextResponse.json({ success: true, links: updated });
});