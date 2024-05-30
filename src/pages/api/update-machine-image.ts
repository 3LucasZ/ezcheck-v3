import type { NextApiResponse } from "next";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { TypedRequestBody } from "types/req";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    image: string;
  }>,
  res: NextApiResponse
) {
  const { id, image } = req.body;
  try {
    const op = await prisma.machine.update({
      where: {
        id,
      },
      data: {
        image,
      },
    });
    return res.status(200).json(op);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
