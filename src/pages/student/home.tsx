import {
  Box,
  Flex,
  HStack,
  Heading,
  IconButton,
  PinInput,
  PinInputField,
  Stack,
  useToast,
  Text,
  Icon,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";

import SearchView from "components/SearchView";

import { useEffect, useState } from "react";
import StudentLayout from "components/Layout/StudentLayout";
import MachineWidget from "components/Widget/MachineWidget";
import { MachineProps } from "types/db";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { PINLen, tealBtn } from "services/constants";
import { poster } from "services/poster";

type PageProps = {
  machines: MachineProps[];
};
export default function Home({ machines }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--relations--
  const inId = me ? me.certificates.map((cert) => cert.machineId) : [];
  const outId = machines
    .map((machine) => machine.id)
    .filter((id) => !inId.includes(id));
  //--states--
  const [isAllowed, setIsAllowed] = useState(true);
  const [newPIN, setNewPIN] = useState(me ? me.PIN : "");
  // useEffect(() => {
  //   setPIN(me?.PIN);
  // }, [session]);
  const [isVisible, setIsVisible] = useState(false);
  //--ret--
  return (
    <StudentLayout me={me} loaded={status !== "loading"}>
      <Stack px={[2, "5vw", "10vw", "15vw"]} alignItems={"center"} spacing="0">
        <Flex flexDir="row" py="8px" gap="8px">
          <Heading>PIN</Heading>
          <IconButton
            icon={isVisible ? <Icon as={FiEyeOff} /> : <Icon as={FiEye} />}
            onClick={() => {
              setIsVisible(!isVisible);
            }}
            aria-label=""
            sx={tealBtn}
          />
        </Flex>
        {me?.PIN == undefined ? (
          <Text>
            You have not been assigned a PIN yet. You are unable to use any
            machine until you receive a PIN from an administrator.
          </Text>
        ) : (
          <HStack spacing={["4px", "8px"]}>
            <PinInput
              value={me?.PIN + "      "} //len of 6 for forced masking
              size={["sm", "md"]}
              mask={!isVisible}
            >
              {Array.from(Array(PINLen).keys()).map((key) => (
                <PinInputField key={key} pointerEvents={"none"} />
              ))}
            </PinInput>
          </HStack>
        )}
      </Stack>
      <Box minH="8px" />
      <Flex flexDir="row" px={[2, "5vw", "10vw", "15vw"]}>
        <Box
          w="100%"
          p="8px"
          roundedLeft="md"
          bg={isAllowed ? "teal.200" : "gray.100"}
          _hover={{ bg: isAllowed ? "teal.200" : "gray.200" }}
          textAlign={"center"}
          onClick={() => setIsAllowed(true)}
        >
          <Heading>{"Allowed"}</Heading>
        </Box>
        <Box
          w="100%"
          p="8px"
          roundedRight="md"
          bg={isAllowed ? "gray.100" : "red.200"}
          _hover={{ bg: isAllowed ? "gray.200" : "red.200" }}
          textAlign={"center"}
          onClick={() => setIsAllowed(false)}
        >
          <Heading>{"Restricted"}</Heading>
        </Box>
      </Flex>

      <SearchView
        setIn={(isAllowed ? inId : outId).map((id) => {
          var machine = machines.find((x) => x.id == id);
          if (!machine) machine = machines[0];
          return {
            name: (me?.using?.id == machine.id ? 0 : 1) + machine.name,
            widget: (
              <MachineWidget
                key={machine.id}
                name={machine.name}
                description={machine.description}
                image={machine.image}
                using={me?.using?.id == machine.id}
                inUse={machine.usedBy != undefined}
                webAuth={machine.webAuth}
                handleLogin={async () => {
                  await poster(
                    "/api/post/join-machine",
                    {
                      machineName: machine?.name,
                      studentPIN: me?.PIN,
                      IP: "DNE",
                    },
                    toaster,
                    false,
                    true
                  );
                }}
                handleLogout={async () => {
                  await poster(
                    "/api/post/leave-machine",
                    {
                      machineName: machine?.name,
                    },
                    toaster
                  );
                }}
              />
            ),
          };
        })}
        isEdit={false}
      />
    </StudentLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const machines = await prisma.machine.findMany({ include: { usedBy: true } });
  return {
    props: {
      machines,
    },
  };
};
