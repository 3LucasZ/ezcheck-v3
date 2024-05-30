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

import nodemailer from "nodemailer";

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
  try {
    //--operation--
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW,
      },
    });

    var mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Invitation to join EZCheck",
      text: "hello",
    };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     return res.status(500).json(error);
    //   } else {
    //     console.log("Email Sent");
    //     return res.status(200).json("ok");
    //   }
    // });

    await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    return res.status(200).json("ok");
  } catch (e) {
    return res.status(500).json(e);
  }
}
