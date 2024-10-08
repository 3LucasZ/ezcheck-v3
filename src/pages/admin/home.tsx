import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import AdminLayout from "components/Layout/AdminLayout";
import { CustomStat } from "components/Main/CustomStat";
import {
  FiUsers,
  FiCpu,
  FiAward,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { responsivePx } from "services/constants";
import prisma from "services/prisma";
import { GetServerSideProps } from "next";
import { User } from "next-auth";
import { CertificateProps, MachineProps } from "types/db";
import CustomDivider from "components/Main/CustomDivider";
import UserWidget from "components/Widget/UserWidget";
import MachineWidget from "components/Widget/MachineWidget";
import { useEffect } from "react";
import InUseWidget from "components/Widget/InUseWidget";

type PageProps = {
  users: User[];
  machines: MachineProps[];
  certificates: CertificateProps[];
};
export default function Home(props: PageProps) {
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const machinesInUse = props.machines.filter(
    (machine) => machine.usedBy != undefined && machine.usedBy != null
  );

  //ret
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
            link={`/admin/manage-users`}
            icon={FiUsers}
            dark="orange.400"
            med="orange.200"
            light="orange.100"
            xlight="orange.50"
          />
          <CustomStat
            label={"Machines"}
            value={"" + props.machines.length}
            link={`/admin/manage-machines`}
            icon={FiCpu}
            dark="red.400"
            med="red.200"
            light="red.100"
            xlight="red.50"
          />
          <CustomStat
            label={"Certificates"}
            value={"" + props.certificates.length}
            link={`/admin/manage-machines`}
            icon={FiAward}
            dark="blue.400"
            med="blue.200"
            light="blue.100"
            xlight="blue.50"
          />
        </SimpleGrid>
        <Box px={responsivePx}>
          <CustomDivider color="orange.300" icon={FiClock} text="In Use" />
          <VStack w="100%">
            {machinesInUse.length > 0 ? (
              machinesInUse.map((machine, index) => (
                <InUseWidget machine={machine} index={index}></InUseWidget>
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
              .map((x, index) => (
                <UserWidget
                  key={x.id}
                  id={x.id}
                  name={x.name}
                  email={x.email}
                  image={x.image}
                  index={index}
                />
              ))}
            {props.machines
              .filter(
                (x) =>
                  !x.description ||
                  !x.image ||
                  x.name.substring(0, 8) == "Machine-"
              )
              .map((x, index) => (
                <MachineWidget
                  key={x.id}
                  id={x.id}
                  name={x.name}
                  description={x.description}
                  image={x.image}
                  index={index}
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
              ...props.users.map((user) => ({
                image: user.image,
                dbImage: false,
                title: user.name,
                url: "/admin/view-user/" + user.id,
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
