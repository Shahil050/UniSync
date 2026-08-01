import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

const AUDIT_ACTION_LABELS: Record<string, string> = {
  CREATE: "created project",
  UPDATE: "updated project",
  DELETE: "deleted project",
  STATUS_CHANGE: "changed status on project",
};

async function checkAiServiceReachable(): Promise<boolean> {
  if (!AI_SERVICE_URL) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    await fetch(AI_SERVICE_URL, { signal: controller.signal });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export const GET = requireAdmin(async function GET() {
  const [totalUsers, totalProjects, totalPapers, totalMessages, totalAgreements, recentLogs, aiReachable] =
    await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.paper.count(),
      prisma.message.count(),
      prisma.contract.count({ where: { status: { in: ["ACTIVE", "COMPLETED"] } } }),
      prisma.projectAuditLog.findMany({
        where: { user: { role: "ADMIN" } },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          action: true,
          createdAt: true,
          user: { select: { fullName: true } },
          project: { select: { title: true } },
        },
      }),
      checkAiServiceReachable(),
    ]);

  return NextResponse.json({
    success: true,
    stats: {
      totalUsers,
      projects: totalProjects,
      researchPapers: totalPapers,
      messages: totalMessages,
      agreements: totalAgreements,
    },
    recentActivity: recentLogs.map((log) => ({
      text: `${log.user.fullName} ${AUDIT_ACTION_LABELS[log.action] ?? log.action.toLowerCase()} "${log.project.title}"`,
      createdAt: log.createdAt,
    })),
    systemStatus: [
      { name: "Server Status", value: "Online", ok: true },
      { name: "Database", value: "Connected", ok: true },
      { name: "AI Recommendation Service", value: aiReachable ? "Reachable" : "Unreachable", ok: aiReachable },
    //   { name: "Content Moderation", value: "Not yet implemented", ok: null },
    ],
  });
});