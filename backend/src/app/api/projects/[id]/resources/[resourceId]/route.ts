import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: projectId, resourceId } = await params;
  if (!isValidUuid(projectId) || !isValidUuid(resourceId)) {
    return NextResponse.json({ success: false, message: "Invalid ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;

  const [resource, project] = await Promise.all([
    prisma.projectResource.findUnique({ where: { id: resourceId }, select: { projectId: true, addedById: true } }),
    prisma.project.findFirst({ where: { id: projectId, deletedAt: null }, select: { ownerId: true } }),
  ]);

  if (!resource || resource.projectId !== projectId || !project) {
    return NextResponse.json({ success: false, message: "Resource not found." }, { status: 404 });
  }

  if (resource.addedById !== userId && project.ownerId !== userId) {
    return NextResponse.json({ success: false, message: "You can't remove this resource." }, { status: 403 });
  }

  await prisma.projectResource.delete({ where: { id: resourceId } });

  return NextResponse.json({ success: true, message: "Resource removed." });
});