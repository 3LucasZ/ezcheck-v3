import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "services/prisma";
import { prismaErrHandler } from "services/prismaErrHandler";
import { serverCreateLog } from "../create-log";
import { TypedRequestBody } from "types/req";
import { formatTimeSince } from "services/utils";

//IMPORTANT RULE #1: all response messages must be short because they have to be
//displayed on a tiny LCD screen.
//IMPORTANT RULE #2: do not change the names in the TypedRequestBody. The elements
//machineName, etc are hard coded into the EZCheck modules already and it will be
//a huge pain to change them all one by one.
export default async function handle(
  req: TypedRequestBody<{
    machineName: string;
  }>,
  res: NextApiResponse
) {
  const { machineName } = req.body;
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
    const user = machine?.usedBy;
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
    //check cases
    if (user == null || machine == null || supervisors.length == 0) {
      serverCreateLog(
        (user == null ? "An unknown user" : user.name) +
          " might be trespassing on " +
          (machine == null
            ? "an unknown machine (" + machineName + ") "
            : machine?.name) +
          ". " +
          supervisorsMsg,
        2
      );
      if (machine == null) {
        return res.status(500).send(machineName + " doesn't exist");
      }
      if (user == null) {
        return res.status(500).send("Already logged out");
      }
      if (supervisors.length == 0) {
        return res.status(500).send("Unsupervised");
      }
    } else {
      await prisma.machine.update({
        where: {
          name: machineName,
        },
        data: {
          usedById: null,
        },
      });
      serverCreateLog(
        machine.usedBy?.name +
          " logged out of " +
          machine.name +
          " (" +
          formatTimeSince(machine.lastLogin) +
          "). " +
          supervisorsMsg,
        0
      );
      return res.status(200).send("Logged out");
    }
  } catch (e) {
    // serverCreateLog("Database error: " + prismaErrHandler(e), 2);
    console.log(e); //print server logs to container console logs
    serverCreateLog("[leave-machine] database error", 2);
    return res.status(500).send("Internal error");
  }
}
