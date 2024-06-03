import type { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/req";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(
  req: TypedRequestBody<{
    machineId: number;
    recipientId: string;
    newNote: string;
  }>,
  res: NextApiResponse
) {
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(403).json("Forbidden");
  //op
  const { machineId, recipientId, newNote } = req.body;
  try {
    const op = await prisma.machineCertificate.update({
      where: {
        machineId_recipientId: {
          machineId,
          recipientId,
        },
      },
      data: {
        note: newNote,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
