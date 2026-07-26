import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = req.auth.user.id;

  // --- Group conversations: projects I'm currently an ACTIVE member of ---
  const memberships = await prisma.projectMember.findMany({
    where: { userId, status: "ACTIVE" },
    select: { project: { select: { id: true, title: true, deletedAt: true } } },
  });

  const activeProjects = memberships
    .map((m) => m.project)
    .filter((p) => p && !p.deletedAt);

  const groupConversations = await Promise.all(
    activeProjects.map(async (project) => {
      const lastMessage = await prisma.message.findFirst({
        where: { projectId: project!.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: { sender: { select: { fullName: true } } },
      });

      return {
        type: "group" as const,
        id: project!.id,
        name: project!.title,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderName: lastMessage.sender.fullName,
              senderId: lastMessage.senderId,
            }
          : null,
      };
    })
  );

  // --- DM conversations: distinct people I've exchanged messages with ---
  const dmMessages = await prisma.message.findMany({
    where: {
      deletedAt: null,
      recipientId: { not: null },
      OR: [{ senderId: userId }, { recipientId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, fullName: true, profileImage: true } },
      recipient: { select: { id: true, fullName: true, profileImage: true } },
    },
  });

  const seenPartners = new Set<string>();
  const dmConversations: any[] = [];

  for (const msg of dmMessages) {
    const otherParty = msg.senderId === userId ? msg.recipient : msg.sender;
    if (!otherParty || seenPartners.has(otherParty.id)) continue;
    seenPartners.add(otherParty.id);

    dmConversations.push({
      type: "dm" as const,
      id: otherParty.id,
      name: otherParty.fullName,
      avatar: otherParty.profileImage,
      lastMessage: {
        content: msg.content,
        createdAt: msg.createdAt,
        senderName: msg.senderId === userId ? "You" : otherParty.fullName,
        senderId: msg.senderId,
      },
    });
  }

  const conversations = [...groupConversations, ...dmConversations].sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  return NextResponse.json({ success: true, conversations });
});