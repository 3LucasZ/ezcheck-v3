import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Layout from "components/Layout/MainLayout";
import { signIn, useSession } from "next-auth/react";
import { FiActivity, FiUsers } from "react-icons/fi";

import Header from "components/Layout/Header";

import { animatedGradient, responsivePx } from "services/constants";
import FeatureCard from "components/FeatureCard";
import Router from "next/router";
import { EZCheckCanvas } from "components/EZCheckCanvas/EZCheckView";
import { useEffect } from "react";
import PWAPrompt from "components/PWAPrompt";

export default function Home() {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  /*
useEffect(() => {
    update();
  }, []);
*/
  const me = session?.user;
  //--3D model states--
  const useBloom = useBreakpointValue({
    base: false,
    sm: true,
  });
  const aspectRatio = 10 / 8.2;
  const widths = [250, 300, 400, 500];
  const heights = widths.map((width) => width * aspectRatio);
  //--ret--
  return (
    <Layout authorized={true} loaded={status !== "loading"}>
      <Header me={me} />
      <Box overflowY={"auto"}>
        <Box px={responsivePx}>
          <Box h={["8", "10", "12", "14", "20"]}></Box>
          <Heading
            fontWeight={600}
            fontSize={["3xl", "4xl", "5xl"]}
            lineHeight={"110%"}
          >
            Machine management{" "}
            <Text
              as={"span"}
              // bgGradient={"linear(to-r, orange.300, red.400)"}
              bgClip={"text"}
              sx={animatedGradient("orange.300", "red.400")}
            >
              made easy
            </Text>
          </Heading>
          <Box h="4"></Box>
          <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} color="gray.500">
            Valley Christian's official machine shop managing platform.
          </Text>
        </Box>

        {/* <Text color={"gray.500"}>
            Whether you are a user or administrator, this is the ultimate
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
                  ? Router.push(me?.isAdmin ? "/admin/home" : "/user/home")
                  : signIn("google", { callbackUrl: "/main" });
              }}
            >
              Get started
            </Button>
            <Box h={["10"]}></Box>
            <FeatureCard
              icon={FiUsers}
              title="Users"
              content="View your information on-demand and real-time."
            />
            <Box h="12" />
            <FeatureCard
              icon={FiActivity}
              title="Admins"
              content="Manage machines and users without any hassle."
            />
            <Box h="8"></Box>
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"orange"}
              bg={"orange.300"}
              _hover={{ bg: "orange.500" }}
              onClick={(e) => {
                e.preventDefault();
                Router.push("/simulator");
              }}
            >
              Try Simulator
            </Button>
          </Box>
          <Box h={"10"} />
          <Box
            h={useBloom ? heights.map((height) => height + "px") : "350px"}
            w={widths.map((width) => width + "px")}
            alignSelf={"center"}
          >
            <EZCheckCanvas useBloom={false} />
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
      <PWAPrompt />
    </Layout>
  );
}
