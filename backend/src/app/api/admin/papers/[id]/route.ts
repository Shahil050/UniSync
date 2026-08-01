import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { deletePaperFile } from "@/lib/paper-storage";

export const PATCH = requireAdmin(async function PATCH(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid paper ID." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const { title, authors, url } = body;
  const data: any = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ success: false, message: "Title cannot be empty." }, { status: 400 });
    }
    data.title = title.trim();
  }
  if (authors !== undefined) data.authors = typeof authors === "string" ? authors.trim() || null : null;
  if (url !== undefined) data.url = typeof url === "string" ? url.trim() || null : null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided to update." }, { status: 400 });
  }

  const result = await prisma.paper.updateMany({ where: { id }, data });
  if (result.count === 0) {
    return NextResponse.json({ success: false, message: "Paper not found." }, { status: 404 });
  }

  const updated = await prisma.paper.findUnique({
    where: { id },
    select: { id: true, title: true, authors: true, url: true },
  });

  return NextResponse.json({ success: true, paper: updated });
});

export const DELETE = requireAdmin(async function DELETE(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid paper ID." }, { status: 400 });
  }

  const paper = await prisma.paper.findUnique({ where: { id }, select: { filePath: true } });
  if (!paper) {
    return NextResponse.json({ success: false, message: "Paper not found." }, { status: 404 });
  }

  await prisma.paper.delete({ where: { id } });
  await deletePaperFile(paper.filePath);

  return NextResponse.json({ success: true, message: "Paper deleted." });
});