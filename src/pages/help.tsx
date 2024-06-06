import { useSession } from "next-auth/react";

import { Box, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { FAQHeader, FAQItem } from "components/Layout/FAQ";
import { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import Router from "next/router";
import UserLayout from "components/Layout/UserLayout";

export default function Home() {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  //--ret--
  return (
    <UserLayout me={me} loaded={status !== "loading"}>
      <Box px={[5, 10, 10, 28, 48, 60]} overflowY="auto">
        <FAQHeader />
        <Box h="8" />
        <VStack align={"start"} gap="4">
          <FAQItem
            Q="What is the version of this website?"
            A="You are currently using version 2.1 of the website."
          />
          <FAQItem
            Q="What does the invert checkbox do?"
            A="When invert mode is on, the display will tell you the opposite of what it originally shows. Example: instead of showing what machines a user is allowed to use, the display will show what machines a user is not allowed to use."
          />
          <FAQItem
            Q="Why does the machine configuration website not load, despite following the instructions?"
            A="The wifi network you are on may have a firewall set up preventing you from accessing other devices on the network. This is often the case in secure environments such as businesses and schools."
          />
          <FAQItem
            Q="Why does the simulator look/function differently from the physical product?"
            A="The simulator is only meant to provide a quick overview of what the EZCheck Module looks like and behaves like. It is considerably different and simplified on purpose."
          />
          <FAQItem
            Q="What is the web auth setting on machines?"
            A="When web auth is enabled on a machine, a user can log in or log out of a machine via the website. This is useful for tracking machines that do not have an EZCheck module created for them yet."
          />
          {/* <FAQItem
            Q="Why are only VCS accounts allowed to use the system?"
            A="For security reasons."
          /> */}
          <FAQItem
            Q="Why are some widgets colored differently in some places?"
            A="Orange: machine is in use by the user in focus. Red: machine is in use. Purple: user is supervising. "
          />
        </VStack>
        <Box h="8"></Box>
        <Box
          p="6"
          bg="orange.200"
          borderRadius={"3xl"}
          maxW="400px"
          w="100%"
          ml="auto"
          overflow={"auto"}
        >
          <Heading color="white" fontSize={"3xl"}>
            Documents
          </Heading>
          <Box h="4"></Box>
          <HStack
            px="4"
            py="3"
            bg="white"
            borderRadius={"2xl"}
            float="left"
            mb="4"
            onClick={() => Router.push("/terms-and-conditions")}
          >
            <Text fontSize={"lg"}>Terms and Conditions</Text>
            <Icon color="orange.400" as={FiExternalLink} />
          </HStack>
          <HStack
            px="4"
            py="3"
            bg="white"
            borderRadius={"2xl"}
            float="left"
            onClick={() => Router.push("/privacy-policy")}
          >
            <Text fontSize={"lg"}>Privacy Policy</Text>
            <Icon color="orange.400" as={FiExternalLink} />
          </HStack>
        </Box>
        <Box h="8"></Box>
      </Box>
    </UserLayout>
  );
}
