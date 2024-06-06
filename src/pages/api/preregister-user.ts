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
import { validEmail } from "services/utils";

export default async function handle(
  req: TypedRequestBody<{
    email: string;
    restrict?: boolean;
  }>,
  res: NextApiResponse
) {
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(403).json("Forbidden");
  //--initialize + checks--
  const { email, restrict } = req.body;
  if (email == "") {
    return res.status(500).json("email can't be empty");
  }
  //In restrict mode, only VCS users can be preregistered.
  //Used in conjunction with preregister-send-email.
  if (restrict && !validEmail(email)) {
    // return res.status(500).json("You can't invite a user outside of VCS");
    return res
      .status(500)
      .json("You can't send an email to a user outside of VCS");
  }
  //Otherwise, anyone can be added on the service via preregistration.
  //Predict the name from the email
  const receiverNames = email.split("@")[0].split(".");
  let receiverName = "";
  receiverNames.map(
    (name) => (receiverName += name[0].toUpperCase() + name.substring(1) + " ")
  );
  receiverName = receiverName.slice(0, -1);
  //--operation--
  try {
    const newUser = await prisma.user.create({
      data: {
        name: receiverName,
        email: email,
        preregistered: true,
      },
    });
    //post process
    return res.status(200).json(newUser.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
