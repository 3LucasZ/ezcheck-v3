import prisma from "./prisma";

export async function serverCreateLog(
  message: string,
  level: number,
  sender?: string
) {
  try {
    const timestamp = Date.now();
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

export async function clientCreateLog(
  message: string,
  level: number,
  sender?: string
) {
  try {
    const timestamp = Date.now();
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
