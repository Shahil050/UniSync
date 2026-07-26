import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId: otherUserId } = await params;
  if (!isValidUuid(otherUserId)) {
    return NextResponse.json({ success: false, message: "Invalid user ID." }, { status: 400 });
  }

  const userId = req.auth.user.id;
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const take = 50;

  const messages = await prisma.message.findMany({
    where: {
      deletedAt: null,
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      sender: { select: { id: true, fullName: true, profileImage: true } },
    },
  });

  return NextResponse.json({ success: true, messages });
});