import { Box, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import { responsivePx } from "services/constants";
import Layout from "./MainLayout";
import Header from "./Header";
import AppBar from "./AppBar";
import { User } from "next-auth";

type LayoutProps = {
  me?: User;
  noDivider?: boolean;
  loaded: boolean;
  children?: ReactNode;
};

export default function AdminLayout({
  me,
  noDivider,
  loaded,
  children,
}: LayoutProps) {
  return (
    <Layout authorized={true} loaded={loaded}>
      <Header me={me} noDivider={noDivider} />
      {children}
      <Box minH="50px"></Box>
      <AppBar />
    </Layout>
  );
}
