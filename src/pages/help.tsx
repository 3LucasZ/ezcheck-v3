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
} from "@chakra-ui/react";
import Header from "components/Layout/Header";
import FAQ from "components/Layout/FAQ";
import { responsivePx } from "services/constants";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Layout>
      {/* <Header isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising} /> */}

      <Box px="5" overflowY="auto">
        <FAQ />
        <Accordion allowToggle px={responsivePx} gap={8}>
          <FAQItem
            Q="What does the invert checkbox do?"
            A="When invert mode is on, the display will tell you what items a
          storage does not contain or what storages an item can not be found in."
          />
          <Box h="8" />
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
        </Accordion>
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
      </Box>
    </Layout>
  );
}

type FAQItemProps = {
  Q: string;
  A: string;
};
function FAQItem(props: FAQItemProps) {
  return (
    <AccordionItem m={4}>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {props.Q}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{props.A}</AccordionPanel>
    </AccordionItem>
  );
}
