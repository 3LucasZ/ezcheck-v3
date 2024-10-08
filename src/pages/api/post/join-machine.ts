import type { NextApiRequest, NextApiResponse } from "next";
import { debugMode } from "services/constants";

import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { serverCreateLog } from "../create-log";
import { TypedRequestBody } from "types/req";

//IMPORTANT RULE #1: all response messages must be short because they have to be
//displayed on a tiny LCD screen.
//IMPORTANT RULE #2: do not change the names in the TypedRequestBody. The elements
//machineName, etc are hard coded into the EZCheck modules already and it will be
//a huge pain to change them all one by one.
export default async function handle(
  req: TypedRequestBody<{
    machineName: string;
    studentPIN: string;
    IP: string;
  }>,
  res: NextApiResponse
) {
  const { machineName, studentPIN, IP } = req.body;
  try {
    //find machine
    const machine = await prisma.machine.findUnique({
      where: {
        name: machineName,
      },
      include: {
        usedBy: true,
      },
    });
    //find user
    const user = await prisma.user.findUnique({
      where: {
        PIN: studentPIN,
      },
      include: {
        certificates: {
          include: {
            machine: true,
          },
        },
        using: true,
      },
    });
    //find supervisors
    const supervisors = await prisma.user.findMany({
      where: {
        isSupervising: true,
      },
    });
    const supervisorsMsg = supervisors.length
      ? "Supervisors: " +
        supervisors.map((supervisor) => supervisor.email).join(", ") +
        "."
      : "No supervisors available.";
    //find user allowed machines
    const allowedMachineNames = user
      ? user.certificates.map((cert) => cert.machine.name)
      : [];

    //check cases
    if (
      machine == null ||
      user == null ||
      IP == null ||
      supervisors.length == 0
    ) {
      serverCreateLog(
        (user == null ? "An unknown user" : user.name) +
          " might be trespassing on " +
          (machine == null
            ? "an unknown machine (" + machineName + ") "
            : machine?.name) +
          " with IP " +
          (IP == null ? "that is hidden" : IP) +
          ". " +
          supervisorsMsg,
        2
      );
      if (machine == null) {
        return res.status(500).send(machineName + " doesn't exist");
      }
      if (user == null) {
        return res.status(500).send("Wrong PIN");
      }
      if (IP == null) {
        return res.status(500).send("Empty IP");
      }
      if (supervisors.length == 0) {
        return res.status(500).send("Unsupervised");
      }
    } else if (user.using != null) {
      serverCreateLog(
        user.name +
          " is trying to use " +
          machine.name +
          ", but is already using " +
          user.using.name +
          ". " +
          supervisorsMsg,
        2
      );
      return res.status(500).send("Already using " + user.using.name);
    } else if (machine.usedBy != null) {
      serverCreateLog(
        user.name +
          " is trying to use " +
          machine.name +
          ", but it is already in use by " +
          machine.usedBy.name +
          ". " +
          supervisorsMsg,
        2
      );
      return res
        .status(500)
        .send(machine.name + " already in use by " + machine.usedBy.name + ".");
    } else if (!allowedMachineNames.includes(machineName)) {
      serverCreateLog(
        user.name +
          " is trying to use " +
          machine.name +
          ", but is not authorized. " +
          supervisorsMsg,
        2
      );
      return res.status(500).send("Not authorized");
    } else {
      await prisma.machine.update({
        where: {
          name: machineName,
        },
        data: {
          usedById: user.id,
          lastLogin: Date.now() / 1000,
          IP: IP,
        },
      });
      serverCreateLog(
        user.name + " started using " + machine.name + ". " + supervisorsMsg,
        0
      );
      return res.status(200).send(user.name);
    }
  } catch (e) {
    //serverCreateLog("Database error: " + prismaErrHandler(e), 2);
    console.log(e); //print server logs to container console logs
    serverCreateLog("[join-machine] database error", 2);
    return res.status(500).send("Internal error");
  }
}
