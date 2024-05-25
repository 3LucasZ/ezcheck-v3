import prisma from "./prisma";

export default async function createLog(
  message: string,
  level: number,
  sender?: string
) {
  try {
    const timestamp = new Date().toLocaleString();
    const op = await prisma.log.create({
      data: {
        sender,
        timestamp,
        message,
        level,
      },
    });
  } catch (e) {}
}
