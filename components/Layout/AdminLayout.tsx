import {
  Avatar,
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { signOut, signIn, useSession } from "next-auth/react";
import React, { ReactNode } from "react";
import { debugMode, responsivePx } from "services/constants";
import Layout from "./MainLayout";
import Header from "./Header";
import AppBar from "./AppBar";
import { User } from "next-auth";

type LayoutProps = {
  me?: User;
  noDivider?: boolean;
  children: ReactNode;
};

export default function AdminLayout({ me, noDivider, children }: LayoutProps) {
  const forbiddenPage = (
    <>
      <Heading px={responsivePx} py="30vh">
        Sorry, you do not have access to this page. Please contact an
        administrator to grant you access.
      </Heading>
    </>
  );
  return (
    <Layout>
      <Header me={me} noDivider={noDivider} />
      {me?.isAdmin ? (
        <>
          {children}
          <Box minH="calc(50px + env(safe-area-inset-bottom))"></Box>
          <AppBar />
        </>
      ) : (
        forbiddenPage
      )}
    </Layout>
  );
}
