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
  responsivePx,
  responsiveSubheaderFontSize,
} from "services/constants";
import { poster } from "services/poster";
import Router from "next/router";
import { useEffect } from "react";

type PageProps = {
  logs: LogProps[];
};
export default function Home({ logs }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();

  const rn = new Date(Date.now());
  const todayStart =
    (rn.getTime() -
      rn.getMilliseconds() -
      rn.getSeconds() * 1000 -
      rn.getMinutes() * 60 * 1000 -
      rn.getHours() * 60 * 60 * 1000) /
    1000;

  let logIterator = 0;
  let daysAgo = 0;
  let titles: string[] = [
    new Date(Date.now()).toLocaleDateString() + " (Today)",
  ];
  let logPartition: [LogProps[]] = [[]];
  while (logIterator < logs.length) {
    while (logs[logIterator].timestamp < todayStart - 24 * 60 * 60 * daysAgo) {
      daysAgo++;
      logPartition.push([]);
      let title = new Date(
        Date.now() - 24 * 60 * 60 * 1000 * daysAgo
      ).toLocaleDateString();
      if (daysAgo == 1) {
        title += " (Yesterday)";
      } else {
        title += ` (${daysAgo} days ago)`;
      }
      titles.push(title);
    }
    logPartition[daysAgo].push(logs[logIterator]);
    logIterator++;
  }
  let logSets = [];
  for (let i = 0; i < titles.length; i++) {
    logSets.push(
      <LogSet
        title={titles[i]}
        cards={logPartition[i].map((log) => ({ ...log }))}
      />
    );
  }

  //--ret--
  return (
    <AdminLayout
      me={me}
      loaded={status !== "loading"}
      // noDivider
    >
      <Box overflowY="auto">
        {logSets}
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
          if (res.status == 200) {
            Router.push("/admin/view-logs");
          }
        }}
      />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const logs = await prisma.log.findMany({
    orderBy: [{ timestamp: "desc" }],
  });
  return {
    props: {
      logs,
    },
  };
};

type LogSetProps = {
  title: string;
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
        //position
        position={"sticky"}
        top={"0"}
        zIndex={500}
        //color
        bg="gray.50"
        //border
        borderColor={"gray.200"}
        borderBottomWidth={2}
        borderBottomRadius={"2xl"}
      >
        <Text fontSize={responsiveHeaderFontSize} py={2} px={[6]}>
          {props.title}
        </Text>
        {/* <Divider /> */}
      </Box>
      <Box h="8"></Box>
      <Box px={[6]}>
        {props.cards.length != 0 ? (
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
        ) : (
          <Text>No logs available to display.</Text>
        )}
      </Box>
    </>
  );
}
type LogCardProps = {
  id: number;
  timestamp: number;
  sender: string;
  message: string;
  level: number;
};
function LogCard(props: LogCardProps) {
  const titles = ["Severe", "Warning", "Info"];
  return (
    <Box h="32">
      <StepDescription>
        {new Date(props.timestamp * 1000).toLocaleTimeString() +
          " (" +
          (props.sender ? props.sender : "System") +
          ")"}
      </StepDescription>
      <StepTitle>{props.message}</StepTitle>
      {/* <Box h="16"></Box> */}
    </Box>
  );
}
