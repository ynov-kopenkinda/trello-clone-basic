import prisma from "database";
export const db: prisma.PrismaClient = new prisma.PrismaClient();
