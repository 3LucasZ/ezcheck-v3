import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Image,
  AspectRatio,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RouteButton } from "components/RouteButton";
import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import prisma from "services/prisma";
import { FiActivity, FiUsers } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { GiSewingMachine, GiTeacher } from "react-icons/gi";
import { IoDocumentText } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";

import { RiAdminLine } from "react-icons/ri";
import { PiStudent, PiStudentBold, PiStudentDuotone } from "react-icons/pi";
import Header from "components/Layout/Header";
import AvatarMenu from "components/Layout/AvatarMenu";

import { responsivePx } from "services/constants";
import FeatureCard from "components/FeatureCard";
import Router from "next/router";
import EZCheck from "components/EZCheckCanvas/EZCheck";
import { EZCheckCanvas } from "components/EZCheckCanvas/EZCheckView";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  const useBloom = useBreakpointValue({
    base: false,
    sm: true,
  });
  const aspectRatio = 10 / 8.2;
  const widths = [250, 300, 400, 500];
  const heights = widths.map((width) => width * aspectRatio);
  return (
    <>
      <Layout>
        <Header isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising} />
        <Box overflowY={"auto"}>
          <Box px={responsivePx}>
            <Box h={["10", "20"]}></Box>
            <Heading
              fontWeight={600}
              fontSize={["3xl", "4xl", "5xl"]}
              lineHeight={"110%"}
            >
              Machine management{" "}
              <Text
                as={"span"}
                bgGradient={"linear(to-r, orange.300, red.400)"}
                bgClip={"text"}
              >
                made easy
              </Text>
            </Heading>
            <Box h="4"></Box>
            <Text
              fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
              color="gray.500"
            >
              Valley Christian's official machine shop managing platform.
            </Text>
          </Box>

          {/* <Text color={"gray.500"}>
            Whether you are a student or administrator, this is the ultimate
            management tool for your Never miss a meeting. Never be late for one
            too. Keep track of your meetings and receive smart reminders in
            appropriate times. Read your smart “Daily Agenda” every morning.
          </Text> */}

          <Flex
            direction={["column", "row"]}
            gap={0}
            pl={responsivePx}
            // h="600px"
          >
            <Box>
              <Box h="8"></Box>
              <Button
                rounded={"full"}
                px={6}
                colorScheme={"orange"}
                bg={"orange.300"}
                _hover={{ bg: "orange.500" }}
                onClick={(e) => {
                  e.preventDefault();
                  session
                    ? Router.push(
                        user?.isAdmin ? "/admin/home" : "/student/home"
                      )
                    : signIn("google", { callbackUrl: "/main" });
                }}
              >
                Get started
              </Button>
              <Box h={["10"]}></Box>
              <FeatureCard
                icon={FiUsers}
                title="Students"
                content="View your information on-demand and real-time."
              />
              <Box h="12" />
              <FeatureCard
                icon={FiActivity}
                title="Admins"
                content="Manage machines and students without any hassle."
              />
            </Box>
            <Box h={"10"} />
            <Box
              h={useBloom ? heights.map((height) => height + "px") : "350px"}
              w={widths.map((width) => width + "px")}
              alignSelf={"center"}
            >
              <EZCheckCanvas useBloom={useBloom} />
            </Box>
          </Flex>
          <Box h="20"></Box>
          {/* <Center>
            <Text fontSize={["2xl", "3xl"]}>Thank you to our sponsors:</Text>
          </Center>
          <HStack w="100%" justify={"center"}>
            <Image src="images/VCS.png" w="20%" p="4"></Image>
            <Image src="images/Q4.png" w="20%"></Image>
          </HStack> */}
        </Box>
      </Layout>
    </>
  );
}
