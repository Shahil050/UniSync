import { prisma } from "./prisma";

const DEFAULTS = {
  sessionTimeoutMinutes: 43200, // 30 days
  maxUploadSizeMB: 20,
};

export async function getSystemSettings() {
  return prisma.systemSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...DEFAULTS },
  });
}