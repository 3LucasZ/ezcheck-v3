//HOW TO RUN THIS FILE: npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/tests/log-delete-test.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.log.deleteMany({});
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
