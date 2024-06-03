import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Account, Profile, Session, User } from "next-auth";
import { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";

import GoogleProvider from "next-auth/providers/google";
import prisma from "services/prisma";

const prismaAdapter = PrismaAdapter(prisma);

export const authOptions = {
  adapter: prismaAdapter as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    //Add data to user object so it is passed along with session
    async session({ session, user }: { session: Session; user: User }) {
      session.user = user;
      //instant lucas admin :D
      if (
        user.email == "lucas.j.zheng@gmail.com" ||
        user.email == "lucas.zheng@warriorlife.net"
      )
        session.user.isAdmin = true;
      return session;
    },
    //Only VCS students/admin can create an account on the service
    //Comment out entire signIn block if dev server
    async signIn({ user }: { user: User }) {
      if (
        user.email.endsWith("@vcs.net") ||
        user.email.endsWith("@warriorlife.net")
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { host } = req.headers;
  if (!host) return res.status(400).send(`Bad Request, missing host header`);

  // process.env.NEXTAUTH_URL = "https://" + host + "/ezfind/api/auth";
  process.env.NEXTAUTH_URL = "https://" + host;
  return NextAuth(authOptions)(req, res);
}

//--Extend prisma adapter to make it ultra fancy :D--
//Copy from official open-source code, then tweak it: https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-prisma/src/index.ts
//some more help: https://next-auth.js.org/configuration/events#createuser
//create new account => move data from old pre-registered account into new one IF it exists
prismaAdapter.createUser = async ({ id: _id, ...data }) => {
  // console.log("CREATE USER");
  //get preregistered account
  const oldUser = await prisma.user.findUnique({
    where: { email: data.email, preregistered: true },
    include: { certificates: true },
  });
  if (oldUser) {
    //preregistered account exists
    //delete old account (await because it must happen BEFORE we create the new guy to prevent conflicting emails!!)
    await prisma.user.delete({
      where: { email: data.email },
    });
    //create new account merged with old account data
    return prisma.user.create({
      data: {
        ...data,
        PIN: oldUser.PIN,
        certificates: {
          createMany: {
            data: oldUser.certificates.map((cert) => ({
              machineId: cert.machineId,
              issuerId: cert.issuerId,
            })),
          },
        },
      },
      include: {
        certificates: true,
      },
    });
  } else {
    //preregistered account DNE
    //create new account as normal
    return prisma.user.create({ data });
  }
};
//retrieve relational columns from user ("include" tag)
prismaAdapter.getSessionAndUser = async (sessionToken) => {
  // console.log("GET SESSION + USER");
  const userAndSession = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: {
          using: true,
          certificates: true,
        },
      },
    },
  });
  if (!userAndSession) return null;
  const { user, ...session } = userAndSession;
  return { user, session };
};
//this is run when a user creates an account for the first time
//it double checks that the created email
//does not coincide with an existing one
//we hack this so it doesn't detect preregistered accounts
prismaAdapter.getUserByEmail = async (email: string) => {
  // console.log("GET USER BY EMAIL");
  const ret = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      using: true,
      certificates: {
        include: {
          machine: true,
          recipient: true,
        },
      },
    },
  });
  if (ret?.preregistered) {
    //if an account is preregistered, we pretend like it never existed at all.
    // Don't worry, we will delete it when a new user is created anyways.
    return null;
  } else {
    return ret;
  }
};
//USELESS (I don't think this is ever called)
prismaAdapter.getUser = (id: string) => {
  // console.log("GET USER");
  return prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      using: true,
      certificates: {
        include: {
          machine: true,
          recipient: true,
        },
      },
    },
  });
};
