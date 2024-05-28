import {
  Box,
  Divider,
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
  useToast,
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
import {
  responsiveHeaderFontSize,
  responsiveSubheaderFontSize,
} from "services/constants";
import { poster } from "services/poster";
import Router from "next/router";

type PageProps = {
  logs: LogProps[];
};
export default function Home({ logs }: PageProps) {
  //--copy paste on every page--
  const { data: session } = useSession();
  const me = session?.user;
  const toaster = useToast();
  //--ret--
  return (
    <AdminLayout
      isAdmin={me?.isAdmin}
      isSupervisor={me?.isSupervising}
      // noDivider
    >
      <Box overflowY="auto">
        <LogSet timestamp={""} cards={logs.map((log) => ({ ...log }))} />
        <LogSet timestamp={""} cards={logs.map((log) => ({ ...log }))} />
        <LogSet timestamp={""} cards={logs.map((log) => ({ ...log }))} />
        <LogSet timestamp={""} cards={logs.map((log) => ({ ...log }))} />
        <LogSet timestamp={""} cards={logs.map((log) => ({ ...log }))} />
        <Box minH="16"></Box>
      </Box>
      <TextingBar
        send={async (e) => {
          const res = await poster(
            "/api/create-log",
            {
              message: e,
              level: 0,
              sender: me?.email,
            },
            toaster
          );
          if (res.status == 200) Router.push("/admin/view-logs");
        }}
      />
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
    <>
      <Box
        position={"sticky"}
        top={"0"}
        zIndex={500}
        bg="gray.50"
        borderColor={"gray.200"}
        borderBottomWidth={2}
        borderBottomRadius={"2xl"}
      >
        <Text fontSize={responsiveHeaderFontSize} py={2} px={5}>
          Today
        </Text>
        {/* <Divider /> */}
      </Box>
      <Box h="8"></Box>
      <Box px="5">
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
      </Box>
    </>
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
    <Box h="32">
      <StepDescription>
        {props.timestamp + " | " + props.author}
      </StepDescription>
      <StepTitle>{props.message}</StepTitle>
      {/* <Box h="16"></Box> */}
    </Box>
  );
}
