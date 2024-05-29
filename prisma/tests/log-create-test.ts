//HOW TO RUN THIS FILE: npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/tests/log-create-test.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const logsNum = 100;
  const maxDaysAgo = 30;
  for (let i = 0; i < logsNum; i++) {
    await prisma.log.create({
      data: {
        timestamp:
          Math.round(Date.now() / 1000) -
          Math.round(Math.random() * maxDaysAgo * 24 * 60 * 60),
        message: "Gibberish #" + i,
        level: Math.floor(Math.random() * 3),
      },
    });
  }
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
