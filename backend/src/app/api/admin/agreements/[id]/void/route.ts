import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prismaRaw } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { voidContract } from "@/lib/void-contract";

export const POST = requireAdmin(async function POST(req: any, { params }: any) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid agreement ID." }, { status: 400 });
  }

  const contract = await prismaRaw.contract.findUnique({ where: { id }, select: { projectId: true } });
  if (!contract) {
    return NextResponse.json({ success: false, message: "Agreement not found." }, { status: 404 });
  }

  const outcome = await voidContract(contract.projectId, req.auth.user.id, { byAdmin: true });

  if (outcome.status !== 200) {
    return NextResponse.json({ success: false, message: outcome.message }, { status: outcome.status });
  }

  return NextResponse.json({ success: true, message: "Agreement voided. All members must re-sign." });
});