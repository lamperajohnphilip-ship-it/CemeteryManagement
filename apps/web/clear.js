import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE inquiries CASCADE;`;
  console.log("Truncated inquiries");
}

main().catch(console.error).finally(() => prisma.$disconnect());
