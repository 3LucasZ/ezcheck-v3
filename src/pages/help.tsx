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
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import Header from "components/Layout/Header";
import FAQ from "components/Layout/FAQ";
import { responsivePx } from "services/constants";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Layout>
      {/* <Header isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising} /> */}

      <Box px={[5, 10, 10, 28, 48, 60]} overflowY="auto">
        <FAQ />
        <Box h="2" />
        <VStack align={"left"}>
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
      </Box>
    </Layout>
  );
}

type FAQItemProps = {
  Q: string;
  A: string;
};
function FAQItem(props: FAQItemProps) {
  const [active, setActive] = useState(false);
  return (
    <Box
      //--color--
      // bg="gray.50"
      bg={active ? "" : "gray.50"}
      color="gray.700"
      // color={active ? "black" : "white"}
      transition={"background-color 0.5s linear, color 0.5s linear"}
      //--sizing--
      w="100%"
      maxW="800px"
      px={"4"}
      pt={"2"}
      pb={active ? "0" : "2"}
      //--border--
      borderRadius={"xl"}
      borderColor={"gray.200"}
      // borderColor={"orange.200"}
      borderWidth={1}
      //function
      cursor={"pointer"}
      onClick={() => setActive(!active)}
    >
      <Text>{props.Q}</Text>
      <Box
        display={"grid"}
        gridTemplateRows={active ? "1fr" : "0fr"}
        transition={"grid-template-rows 0.5s ease-out"}
      >
        <Box overflow={"hidden"}>
          <Box h="4" />
          <Text>{props.A}</Text>
          <Box h="2" />
        </Box>
      </Box>
    </Box>
  );
}
/*
 <Text fontSize="4xl">Version</Text>
        <Text fontSize="xl">2.1 (Alpha)</Text>
        <Text fontSize="4xl">Q&A</Text>
        <Text fontSize="xl">
          Q: Why is the website considered unsafe and untrusted by Safari and
          Chrome?
        </Text>
        <Text fontSize="xl">
          A: The website is in the alpha version and running on a local
          development server. Rest assured, your data is safe. Check out our
          privacy policy and terms of service below.
        </Text>
        <Text fontSize="xl">Q: What does the invert checkbox do?</Text>
        <Text fontSize="xl">
          A: When invert mode is on, the display will tell you what machines a
          student does not have access to, and which students can not use a
          machine.
        </Text>
        <Text fontSize={"4xl"}>Documents</Text>
        <Link
          color="teal.500"
          href="https://www.freeprivacypolicy.com/live/867a55b1-f612-458c-a96b-73337e43fe99"
          display={"block"}
          fontSize={"xl"}
        >
          Privacy Policy
        </Link>
        <Link
          color="teal.500"
          href="https://www.freeprivacypolicy.com/live/a127aadd-459e-4134-89e1-c2773f78391f"
          display={"block"}
          fontSize={"xl"}
        >
          Terms of Service
        </Link>

        <Box h="10px"></Box>
*/
