import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";
import { User } from "next-auth";
import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { CertificateProps } from "types/db";
import { TypedRequestBody } from "types/req";
import handleCreateLog from "./create-log";
import { NextRequest, NextResponse } from "next/server";

export default async function handle(
  req: TypedRequestBody<{
    requester: User;
    id: string;
    //student
    newPIN?: string;
    newCerts?: CertificateProps[];
    //admin
    isAdmin?: boolean;
    isSupervising?: boolean;
  }>,
  res: NextApiResponse
) {
  //initialize + checks
  const { requester, id, newPIN, newCerts, isAdmin, isSupervising } = req.body;
  console.log(req.body);
  console.log(isSupervising);
  const newRelations = newCerts?.map((cert) => ({
    machineId: cert.machineId!,
    issuerId: cert.issuerId,
  }));
  if (newPIN == "") return res.status(500).json("PIN can't be empty");
  //update student
  try {
    const oldStudent = await prisma.user.findUnique({ where: { id } });
    const op = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(newPIN != undefined && { PIN: newPIN }),
        ...(newRelations != undefined && {
          certificates: {
            deleteMany: {}, //delete all current certificates
            createMany: { data: newRelations }, //re-create all certificates
          },
        }),
        ...(isAdmin != undefined && { isAdmin: isAdmin }),
        ...(isSupervising != undefined && { isSupervising: isSupervising }),
      },
      include: {
        ...(newRelations != undefined && { certificates: true }),
      },
    });
    //log certificate changes

    //log admin changes
    if (oldStudent?.isAdmin == false && isAdmin == true) {
      try {
        const op = await prisma.log.create({
          data: {
            timestamp: Date.now() / 1000,
            message:
              requester.name +
              " granted admin privileges to " +
              oldStudent.name +
              ".",
            level: 0,
          },
        });
      } catch (e) {
        return res.status(500).json(prismaErrHandler(e));
      }
    } else if (oldStudent?.isAdmin == true && isAdmin == false) {
      try {
        const op = await prisma.log.create({
          data: {
            timestamp: Date.now() / 1000,
            message:
              requester.name +
              " removed admin privileges from " +
              oldStudent.name +
              ".",
            level: 0,
          },
        });
      } catch (e) {
        return res.status(500).json(prismaErrHandler(e));
      }
    }
    //post process
    return res.status(200).json(op.id);
  } catch (e) {
    return res.status(500).json(prismaErrHandler(e));
  }
}
