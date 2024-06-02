import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { TypedRequestBody } from "types/req";
import { authOptions } from "./auth/[...nextauth]";

import nodemailer from "nodemailer";

import { GetInviteEmailHtml } from "../../../components/InviteEmail";

export default async function handle(
  req: TypedRequestBody<{
    receiverEmail: string;
    senderEmail: string;
    senderName: string;
  }>,
  res: NextApiResponse
) {
  //--API Protection--
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user.isAdmin) return res.status(401).json("Unauthorized");
  //--initialize + checks--
  const { receiverEmail, senderEmail, senderName } = req.body;
  if (receiverEmail == "") {
    return res.status(500).json("email can't be empty");
  }
  // else if (
  //   !receiverEmail.endsWith("@vcs.net") &&
  //   !receiverEmail.endsWith("@warriorlife.net")
  // ) {
  //   return res.status(500).json("You can't invite a user outside of VCS");
  // }
  //try to guess the name from the email ;)
  const receiverNames = receiverEmail.split("@")[0].split(".");
  let receiverName = "";
  receiverNames.map(
    (name) => (receiverName += name[0].toUpperCase() + name.substring(1) + " ")
  );
  receiverName = receiverName.slice(0, -1);
  //--webpage :)--
  const emailHtml = GetInviteEmailHtml({
    receiverName: receiverName,
    receiverEmail: receiverEmail,
    senderEmail: senderEmail,
    senderName: senderName,
  });
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
      from: `VCS EZSuite <${process.env.NODEMAILER_EMAIL}>`,
      to: receiverEmail,
      subject: "Welcome to EZCheck",
      html: emailHtml,
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
