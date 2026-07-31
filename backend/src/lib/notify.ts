import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/generated/prisma/client";

type TransactionCallback = Parameters<typeof prisma.$transaction>[0];
type PrismaTransactionClient = TransactionCallback extends (tx: infer T) => any ? T : never;

export async function notify(
  tx: PrismaTransactionClient | typeof prisma, // not Prisma.TransactionClient — that's the mismatch
  params: { userId: string; type: NotificationType; message: string; projectId?: string }
) {
  await tx.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      message: params.message,
      projectId: params.projectId ?? null,
    },
  });
}