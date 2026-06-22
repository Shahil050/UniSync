import { PrismaClient } from "@prisma/client/extension";

type ExtArgs = { model: string; args: any; query: (args: any) => Promise<any> };

const SOFT_DELETE_MODELS = ["User"];
// Add later
// const SOFT_DELETE_MODELS = ["User", "Project", "Paper", "Message", "Contract"];

function createPrismaClient() {
    return new PrismaClient().$extends({
        query: {
            $allModels: {
                // Reads: silently exclude soft-deleted rows.
                async findFirst({ model, args, query }: ExtArgs) {
                    if (SOFT_DELETE_MODELS.includes(model)) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                    return query(args);
                },
                async findMany({ model, args, query }: ExtArgs) {
                    if (SOFT_DELETE_MODELS.includes(model)) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                    return query(args);
                },
                async count({ model, args, query }: ExtArgs) {
                    if (SOFT_DELETE_MODELS.includes(model)) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                    return query(args);
                },
        
                // Writes: turn delete/deleteMany into an update that sets deletedAt.
                async delete({ model, args, query }: ExtArgs) {
                    if (SOFT_DELETE_MODELS.includes(model)) {
                        return (prisma as any)[model.charAt(0).toLowerCase() + model.slice(1)].update({
                        where: args.where,
                        data: { deletedAt: new Date() },
                        });
                    }
                    return query(args);
                },
                async deleteMany({ model, args, query }: ExtArgs) {
                    if (SOFT_DELETE_MODELS.includes(model)) {
                        return (prisma as any)[model.charAt(0).toLowerCase() + model.slice(1)].updateMany({
                        where: args.where,
                        data: { deletedAt: new Date() },
                        });
                    }
                    return query(args);
                },
            },
        },
    });
}


// Next.js dev mode reloads modules on every save, which would otherwise spin up a new PrismaClient (and a new DB connection pool) each time.
// Caching it on `globalThis` in non-production keeps one instance alive across hot reloads.
const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
