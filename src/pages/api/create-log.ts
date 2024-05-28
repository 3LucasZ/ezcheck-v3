import { ServerResponse } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    sender?: string;
    message: string;
    level: number;
  }>,
  res: NextApiResponse
) {
  const { sender, message, level } = req.body;
  try {
    const op = await prisma.log.create({
      data: {
        timestamp: Date.now() / 1000,
        sender,
        message,
        level,
      },
    });
    return res.status(200).json(op.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
