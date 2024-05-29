import {
  AbsoluteCenter,
  Box,
  Divider,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import AdminLayout from "components/Layout/AdminLayout";
import { CustomStat } from "components/Main/CustomStat";
import { group } from "console";
import {
  FiUsers,
  FiCpu,
  FiAward,
  FiCompass,
  FiZap,
  FiWatch,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { responsivePx } from "services/constants";
import prisma from "services/prisma";
import { GetServerSideProps } from "next";
import { User } from "next-auth";
import { CertificateProps, MachineProps } from "types/db";
import Carousel from "components/Main/Carousel";
import CustomDivider from "components/Main/CustomDivider";
import UserWidget from "components/Widget/UserWidget";
import MachineWidget from "components/Widget/MachineWidget";
import { AiFillHourglass } from "react-icons/ai";
import { BiHourglass } from "react-icons/bi";

type PageProps = {
  users: User[];
  machines: MachineProps[];
  certificates: CertificateProps[];
};
export default function Home(props: PageProps) {
  const { data: session, status } = useSession();
  const me = session?.user;
  const machinesInUse = props.machines.filter(
    (machine) => machine.usedBy != undefined && machine.usedBy != null
  );
  return (
    <AdminLayout me={me} loaded={status !== "loading"}>
      <Box overflowY="auto">
        <SimpleGrid
          columns={3}
          gap={[2, 4, 6]}
          px={responsivePx}
          py={[4, 6, 8]}
        >
          <CustomStat
            label={"Users"}
            value={"" + props.users.length}
            link={`/admin/manage-students`}
            icon={FiUsers}
            dark="cyan.400"
            med="cyan.200"
            light="cyan.100"
            xlight="cyan.50"
          />
          <CustomStat
            label={"Machines"}
            value={"" + props.machines.length}
            link={`/admin/manage-machines`}
            icon={FiCpu}
            dark="blue.400"
            med="blue.200"
            light="blue.100"
            xlight="blue.50"
          />
          <CustomStat
            label={"Certificates"}
            value={"" + props.certificates.length}
            link={`/admin/manage-machines`}
            icon={FiAward}
            dark="orange.400"
            med="orange.200"
            light="orange.100"
            xlight="orange.50"
          />
        </SimpleGrid>
        <Box px={responsivePx}>
          <CustomDivider color="orange.300" icon={FiClock} text="In Use" />
          <VStack w="100%">
            {machinesInUse.length > 0 ? (
              machinesInUse.map((machine) => (
                <HStack minW="100%">
                  <MachineWidget
                    url={`/admin/view-machine/${machine.id}`}
                    name={machine.name}
                    image={machine.image}
                  />
                  {/* <Text>{"< == >"}</Text> */}
                  <UserWidget
                    id={machine.usedBy.id}
                    name={machine.usedBy.name}
                    image={machine.usedBy.image}
                  />

                  <VStack minW="100px">
                    <Text noOfLines={1}>
                      {new Date(machine.lastLogin * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </Text>
                    <Text fontSize={"xs"} color="gray.600" noOfLines={1}>
                      {new Date(
                        Date.now() - machine.lastLogin * 1000
                      ).getUTCHours() +
                        " hrs " +
                        new Date(
                          Date.now() - machine.lastLogin * 1000
                        ).getUTCMinutes() +
                        " mins"}
                    </Text>
                  </VStack>
                </HStack>
              ))
            ) : (
              <Text>{"No machines in use."}</Text>
            )}
          </VStack>
          <CustomDivider
            color="orange.300"
            icon={FiAlertTriangle}
            text="Incomplete"
          />
          <VStack>
            {props.users
              .filter((x) => !x.PIN)
              .map((x) => (
                <UserWidget
                  id={x.id}
                  name={x.name}
                  email={x.email}
                  image={x.image}
                />
              ))}
            {props.machines
              .filter(
                (x) =>
                  !x.description ||
                  !x.image ||
                  x.name.substring(0, 8) == "Machine-"
              )
              .map((x) => (
                <MachineWidget
                  name={x.name}
                  description={x.description}
                  image={x.image}
                  url={`/admin/view-machine/${x.id}`}
                />
              ))}
          </VStack>
        </Box>
        <Box h="16"></Box>
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await prisma.user.findMany();
  const machines = await prisma.machine.findMany({ include: { usedBy: true } });
  const certificates = await prisma.machineCertificate.findMany();

  return {
    props: {
      users,
      machines,
      certificates,
    },
  };
};
/*
<Carousel
            cards={[
              ...props.students.map((student) => ({
                image: student.image,
                dbImage: false,
                title: student.name,
                url: "/admin/view-student/" + student.id,
              })),
              ...props.machines.map((machine) => ({
                image: machine.image,
                dbImage: true,
                title: machine.name,
                url: "/admin/view-machine/" + machine.id,
              })),
            ]}
          />
*/
