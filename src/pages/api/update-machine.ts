import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { CertificateProps } from "types/db";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
  }>,
  res: NextApiResponse
) {
  const { id, newName, newDescription } = req.body;
  if (newName == "")
    return res.status(500).json("Machine name can not be empty.");
  try {
    const op = await prisma.machine.update({
      where: {
        id: id,
      },
      data: {
        name: newName,
        description: newDescription,
      },
    });
    return res.status(200).json(op.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
