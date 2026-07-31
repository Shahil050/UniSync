import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const PATCH = auth(async function PATCH(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid notification ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;
  const result = await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });

  if (result.count === 0) {
    return NextResponse.json({ success: false, message: "Notification not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
});

export const DELETE = auth(async function DELETE(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid notification ID." }, { status: 400 });
  }

  const result = await prisma.notification.deleteMany({
    where: { id, userId: req.auth.user.id },
  });

  if (result.count === 0) {
    return NextResponse.json({ success: false, message: "Notification not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
});