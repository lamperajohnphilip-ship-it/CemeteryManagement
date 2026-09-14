import { PrismaClient } from './generated/prisma-client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Force re-instantiation if the cached global client lacks newly added models (e.g. emailVerification)
if (globalForPrisma.prisma && (!(globalForPrisma.prisma as any).emailVerification || !(globalForPrisma.prisma as any).emailNotificationLog)) {
  try {
    globalForPrisma.prisma.$disconnect();
  } catch (e) {}
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

