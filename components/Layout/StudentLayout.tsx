import { Heading } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Layout from "./MainLayout";
import Header from "./Header";
import { User } from "next-auth";

type LayoutProps = {
  me?: User;
  children: ReactNode;
};

export default function StudentLayout({ me, children }: LayoutProps) {
  const forbiddenPage = (
    <>
      <Heading px={[2, "5vw", "10vw", "15vw"]} py="30vh">
        Sorry, you do not have access to this page. Please contact an
        administrator to grant you access.
      </Heading>
    </>
  );
  return (
    <Layout>
      <Header me={me} />
      {me ? <>{children}</> : forbiddenPage}
    </Layout>
  );
}
