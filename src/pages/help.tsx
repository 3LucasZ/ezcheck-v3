import Layout from "components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  HStack,
  Icon,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import Header from "components/Layout/Header";
import { FAQHeader, FAQItem } from "components/Layout/FAQ";
import { responsivePx } from "services/constants";
import { useState } from "react";
import { FiChevronDown, FiChevronLeft, FiExternalLink } from "react-icons/fi";
import Router from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Layout>
      {/* <Header isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising} /> */}

      <Box px={[5, 10, 10, 28, 48, 60]} overflowY="auto">
        <FAQHeader />
        <Box h="8" />
        <VStack align={"start"} gap="4">
          <FAQItem
            Q="What does the invert checkbox do?"
            A="When invert mode is on, the display will tell you what items a
          storage does not contain or what storages an item can not be found in."
          />
          <FAQItem
            Q="What does the invert checkbox do?"
            A="When invert mode is on, the display will tell you what items a
          storage does not contain or what storages an item can not be found in."
          />
          <FAQItem
            Q="What does the invert checkbox do?"
            A="When invert mode is on, the display will tell you what items a
          storage does not contain or what storages an item can not be found in."
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
    </Layout>
  );
}
