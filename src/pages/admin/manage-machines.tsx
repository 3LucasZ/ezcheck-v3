import { GetServerSideProps } from "next";
import SearchView from "components/SearchView";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import Router from "next/router";
import AdminLayout from "components/Layout/AdminLayout";
import { FAB } from "components/Layout/FAB/FAB";
import { AddIcon } from "@chakra-ui/icons";
import { poster } from "services/poster";
import { useToast } from "@chakra-ui/react";
import { MachineProps } from "types/db";
import MachineWidget from "components/Widget/MachineWidget";

import { Text } from "@chakra-ui/react";
import { orangeBtn, responsiveHeaderFontSize } from "services/constants";
import { useEffect } from "react";

type PageProps = {
  machines: MachineProps[];
};
export default function ManageMachines({ machines }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--ret--
  return (
    <AdminLayout me={me} loaded={status !== "loading"}>
      <Text fontSize={responsiveHeaderFontSize} textAlign={"center"}>
        Machines
      </Text>
      <SearchView
        setIn={machines.map((machine) => ({
          name: machine.name,
          widget: (
            <MachineWidget
              key={machine.id}
              name={machine.name}
              description={machine.description}
              image={machine.image}
              url={`/admin/view-machine/${machine.id}`}
            />
          ),
        }))}
        isEdit={false}
      />
      <FAB
        onClick={async () => {
          const body = {};
          const res = await poster("/api/create-machine", body, toaster);
          if (res.status == 200) {
            await Router.push("/admin/view-machine/" + (await res.json()));
          }
        }}
        icon={AddIcon}
        sx={orangeBtn}
      />
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const machines = await prisma.machine.findMany({
    include: {
      usedBy: true,
    },
  });
  return {
    props: { machines },
  };
};
