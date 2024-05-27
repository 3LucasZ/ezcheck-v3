import {
  Box,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
} from "@chakra-ui/react";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import LogWidget, { LogProps } from "components/Widget/LogWidget";
import AdminLayout from "components/Layout/AdminLayout";
import { TextingBar } from "components/Layout/TextingBar";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { FiAlertCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

type PageProps = {
  logs: LogProps[];
};
export default function Home({ logs }: PageProps) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <AdminLayout isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising}>
      <Box gap="8px" overflowY="auto" px="5" display="grid">
        <Box minH="0px"></Box>
        {/* {logs.map((log) => (
          <LogWidget log={log}></LogWidget>
        ))} */}
        <LogSet timestamp={""} cards={logs.map((log) => ({ ...log }))} />
        <Box minH="16"></Box>
      </Box>
      <TextingBar send={(e) => console.log(e)} />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const logs = await prisma.log.findMany({
    orderBy: [{ id: "asc" }],
  });
  return {
    props: {
      logs,
    },
  };
};

type LogSetProps = {
  timestamp: string;
  cards: LogCardProps[];
};
function LogSet(props: LogSetProps) {
  // const icons = [FiInfo, FiAlertCircle, FiAlertTriangle];
  const icons = ["i", "!", "!"];
  const background = ["blue.300", "orange.300", "red.300"];
  const borderColor = ["blue.600", "orange.600", "red.600"];

  return (
    <Stepper
      index={-1}
      orientation="vertical"
      // height="400px"
      gap="0"
    >
      {props.cards.map((x) => (
        <Step>
          <StepIndicator
            sx={{
              "[data-status=incomplete] &": {
                background: background[x.level],
                borderColor: borderColor[x.level],
              },
            }}
          >
            <StepStatus
              incomplete={
                <Text color="white" fontWeight={"bold"}>
                  {icons[x.level]}
                </Text>
              }
            />
          </StepIndicator>
          <LogCard {...x} />
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
}
type LogCardProps = {
  id: number;
  timestamp: string;
  author: string;
  message: string;
  level: number;
};
function LogCard(props: LogCardProps) {
  const titles = ["Severe", "Warning", "Info"];
  return (
    <Box>
      <StepDescription>
        {props.timestamp + " | " + props.author}
      </StepDescription>
      <StepTitle>{props.message}</StepTitle>
      <Box h="16"></Box>
    </Box>
  );
}
