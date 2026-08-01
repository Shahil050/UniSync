import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prismaRaw } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";

export const GET = requireAdmin(async function GET(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid agreement ID." }, { status: 400 });
  }

  const contract = await prismaRaw.contract.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, title: true, owner: { select: { id: true, fullName: true } } } },
      roles: { include: { user: { select: { id: true, fullName: true } } } },
      signatures: { select: { userId: true, signedAt: true } },
    },
  });

  if (!contract) {
    return NextResponse.json({ success: false, message: "Agreement not found." }, { status: 404 });
  }

  const signedMap = new Map(contract.signatures.map((s) => [s.userId, s.signedAt]));

  return NextResponse.json({
    success: true,
    agreement: {
      id: contract.id,
      project: contract.project.title,
      projectId: contract.project.id,
      status: contract.status,
      content: contract.content,
      dueDate: contract.dueDate,
      createdAt: contract.createdAt,
      finalizedAt: contract.finalizedAt,
      members: contract.roles.map((r) => ({
        userId: r.userId,
        name: r.user.fullName,
        roleTitle: r.roleTitle,
        responsibilities: r.responsibilities,
        signedAt: signedMap.get(r.userId) ?? null,
      })),
    },
  });
});