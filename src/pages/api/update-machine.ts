import type { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { CertificateProps } from "types/db";
import { TypedRequestBody } from "types/req";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(
  req: TypedRequestBody<{
    id: number;
    newName: string;
    newDescription: string;
    newWebAuth: boolean;
    addCerts?: CertificateProps[];
    rmCerts?: CertificateProps[];
  }>,
  res: NextApiResponse
) {
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(403).json("Forbidden");
  //--Update machine--
  const { id, newName, newDescription, newWebAuth, addCerts, rmCerts } =
    req.body;
  const addRelations = addCerts
    ? addCerts.map((cert) => ({
        recipientId: cert.recipientId!,
        issuerId: cert.issuerId,
      }))
    : [];
  const rmRelations = rmCerts
    ? rmCerts.map((cert) => ({
        recipientId: cert.recipientId!,
        issuerId: cert.issuerId,
      }))
    : [];
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
        webAuth: newWebAuth,
        certificates: {
          deleteMany: rmRelations, //extremely important, this denotes that you want to delete relations too
          createMany: {
            data: addRelations,
          },
        },
      },
      include: {
        certificates: true,
      },
    });
    return res.status(200).json(op.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
