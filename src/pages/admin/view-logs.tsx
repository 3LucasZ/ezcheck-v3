import { Box, Flex } from "@chakra-ui/react";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import { checkAdmin, getMyAdmin } from "services/userHandler";
import { AdminProps } from "archive/AdminWidget2";
import LogWidget, { LogProps } from "components/Widget/LogWidget";
import AdminLayout from "components/Layout/AdminLayout";

type PageProps = {
  admins: AdminProps[];
  logs: LogProps[];
};
export default function Home({ admins, logs }: PageProps) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <AdminLayout isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising}>
      <Box gap="8px" overflowY="auto" px="5" display="grid">
        <Box minH="0px"></Box>
        {logs.map((log) => (
          <LogWidget log={log}></LogWidget>
        ))}
        <Box minH="0px"></Box>
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const logs = await prisma.log.findMany({
    orderBy: [{ id: "desc" }],
  });
  return {
    props: {
      logs,
    },
  };
};
