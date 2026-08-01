import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/lib/settings";

export const GET = requireAdmin(async function GET() {
  const settings = await getSystemSettings();
  return NextResponse.json({
    success: true,
    settings: {
      sessionTimeoutMinutes: settings.sessionTimeoutMinutes,
      maxUploadSizeMB: settings.maxUploadSizeMB,
      updatedAt: settings.updatedAt,
    },
  });
});

export const PATCH = requireAdmin(async function PATCH(req: any) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const { sessionTimeoutMinutes, maxUploadSizeMB } = body;
  const data: any = {};

  if (sessionTimeoutMinutes !== undefined) {
    if (!Number.isInteger(sessionTimeoutMinutes) || sessionTimeoutMinutes < 5 || sessionTimeoutMinutes > 129600) {
      return NextResponse.json(
        { success: false, message: "sessionTimeoutMinutes must be between 5 and 129600 (90 days)." },
        { status: 400 }
      );
    }
    data.sessionTimeoutMinutes = sessionTimeoutMinutes;
  }

  if (maxUploadSizeMB !== undefined) {
    if (!Number.isInteger(maxUploadSizeMB) || maxUploadSizeMB < 1 || maxUploadSizeMB > 100) {
      return NextResponse.json(
        { success: false, message: "maxUploadSizeMB must be between 1 and 100." },
        { status: 400 }
      );
    }
    data.maxUploadSizeMB = maxUploadSizeMB;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ success: false, message: "No valid fields provided to update." }, { status: 400 });
  }

  data.updatedById = req.auth.user.id;

  // Ensure the row exists before updating (first-ever edit could race the lazy seed).
  await getSystemSettings();

  const updated = await prisma.systemSettings.update({ where: { id: "singleton" }, data });

  return NextResponse.json({
    success: true,
    settings: {
      sessionTimeoutMinutes: updated.sessionTimeoutMinutes,
      maxUploadSizeMB: updated.maxUploadSizeMB,
      updatedAt: updated.updatedAt,
    },
  });
});