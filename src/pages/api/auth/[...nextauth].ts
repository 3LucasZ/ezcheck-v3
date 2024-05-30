import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Session, User } from "next-auth";
import { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";

import GoogleProvider from "next-auth/providers/google";
import prisma from "services/prisma";

const { GOOGLE_ID = "", GOOGLE_SECRET = "" } = process.env;

const prismaAdapter = PrismaAdapter(prisma);

export const authOptions = {
  adapter: prismaAdapter as Adapter,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
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
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { host } = req.headers;
  if (!host) return res.status(400).send(`Bad Request, missing host header`);

  // process.env.NEXTAUTH_URL = "https://" + host + "/ezfind/api/auth";
  process.env.NEXTAUTH_URL = "https://" + host;

  return NextAuth(authOptions)(req, res);
}

prismaAdapter.getUser = (id: string) => {
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
prismaAdapter.getUserByEmail = (email: string) => {
  return prisma.user.findUnique({
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
};
prismaAdapter.getSessionAndUser = async (sessionToken) => {
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
