import { ServerResponse } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/req";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(
  req: TypedRequestBody<{
    sender?: string;
    message: string;
    level: number;
  }>,
  res: NextApiResponse
) {
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(403).json("Forbidden");
  //--Create log--
  const { sender, message, level } = req.body;
  const ret = await serverCreateLog(message, level, sender);
  return res.status(ret.status).json(ret.json);
}
export async function serverCreateLog(
  message: string,
  level: number,
  sender?: string
) {
  try {
    const op = await prisma.log.create({
      data: {
        timestamp: Date.now() / 1000,
        sender,
        message,
        level,
      },
    });
    await prisma.log.deleteMany({
      where: {
        timestamp: {
          lte: Date.now() / 1000 - 30 * 24 * 60 * 60,
        },
      },
    });
    return { status: 200, json: "" + op.id };
  } catch (e) {
    return { status: 500, json: prismaErrHandler(e) };
  }
}
