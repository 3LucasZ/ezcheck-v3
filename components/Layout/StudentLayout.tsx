import { Heading } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Layout from "./MainLayout";
import Header from "./Header";
import { User } from "next-auth";

type LayoutProps = {
  me?: User;
  loaded: boolean;
  children: ReactNode;
};

export default function StudentLayout({ me, loaded, children }: LayoutProps) {
  return (
    <Layout authorized={me != undefined} loaded={false}>
      <Header me={me} />
      {children}
    </Layout>
  );
}
