import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";
import { getServerSession, User } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { CertificateProps } from "types/db";
import { TypedRequestBody } from "types/req";
import handleCreateLog from "./create-log";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(
  req: TypedRequestBody<{
    email: string;
  }>,
  res: NextApiResponse
) {
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(401).json("Unauthorized");
  //--initialize + checks--
  const { email } = req.body;
  const receiverNames = email.split("@")[0].split(".");
  let receiverName = "";
  receiverNames.map(
    (name) => (receiverName += name[0].toUpperCase() + name.substring(1) + " ")
  );
  receiverName = receiverName.slice(0, -1);
  //--operation--
  try {
    const newStudent = await prisma.user.create({
      data: {
        name: receiverName,
        email: email,
        preregistered: true,
      },
    });
    //post process
    return res.status(200).json(newStudent.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
