import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type ExtArgs = { model: string; args: any; query: (args: any) => Promise<any> };

const SOFT_DELETE_MODELS = ["User"];
// Add later
// const SOFT_DELETE_MODELS = ["User", "Project", "Paper", "Message", "Contract"];

function createPrismaClient() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const client = new PrismaClient({ adapter });
    
    return client.$extends({
        query: {
            $allModels: {
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
                async delete({ model, args, query }: ExtArgs) {
                    if (SOFT_DELETE_MODELS.includes(model)) {
                        return (client as any)[model.charAt(0).toLowerCase() + model.slice(1)].update({
                            where: args.where,
                            data: { deletedAt: new Date() },
                        });
                    }
                    return query(args);
                },
                async deleteMany({ model, args, query }: ExtArgs) {
                    if (SOFT_DELETE_MODELS.includes(model)) {
                        return (client as any)[model.charAt(0).toLowerCase() + model.slice(1)].updateMany({
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

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}