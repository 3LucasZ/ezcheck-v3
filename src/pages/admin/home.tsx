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
import { FiUsers, FiCpu, FiAward, FiCompass, FiZap } from "react-icons/fi";
import { responsivePx } from "services/constants";
import prisma from "services/prisma";
import { GetServerSideProps } from "next";
import { User } from "next-auth";
import { CertificateProps, MachineProps } from "types/db";
import Carousel from "components/Main/Carousel";
import CustomDivider from "components/Main/CustomDivider";
import UserWidget from "components/Widget/UserWidget";
import MachineWidget from "components/Widget/MachineWidget";

type PageProps = {
  students: User[];
  machines: MachineProps[];
  certificates: CertificateProps[];
};
export default function Home(props: PageProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const machinesInUse = props.machines.filter(
    (machine) => machine.usedBy != undefined && machine.usedBy != null
  );
  console.log(machinesInUse);
  return (
    <AdminLayout isAdmin={user?.isAdmin} isSupervisor={user?.isSupervising}>
      <Box overflowY="auto">
        <SimpleGrid
          columns={3}
          gap={[2, 4, 6]}
          px={responsivePx}
          py={[4, 6, 8]}
        >
          <CustomStat
            label={"Students"}
            value={"" + props.students.length}
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
          <CustomDivider
            color="orange.300"
            icon={FiZap}
            text="Recently Created"
          />
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
          <CustomDivider color="orange.300" icon={FiZap} text="In Use" />
          <VStack w="100%">
            {machinesInUse.length > 0 ? (
              machinesInUse.map((machine) => (
                <HStack minW="100%">
                  <MachineWidget
                    url={`/admin/view-machine/${machine.id}`}
                    name={machine.name}
                    description={machine.description}
                    image={machine.image}
                  />
                  {/* <Text>{"< == >"}</Text> */}
                  <UserWidget
                    id={machine.usedBy.id}
                    name={machine.usedBy.name}
                    email={machine.usedBy.email}
                    image={machine.usedBy.image}
                  />
                </HStack>
              ))
            ) : (
              <Text>{"No data to display"}</Text>
            )}
          </VStack>
        </Box>
        <Box h="16"></Box>
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const students = await prisma.user.findMany({ where: { isAdmin: false } });
  const machines = await prisma.machine.findMany({ include: { usedBy: true } });
  const certificates = await prisma.machineCertificate.findMany();

  return {
    props: {
      students,
      machines,
      certificates,
    },
  };
};
