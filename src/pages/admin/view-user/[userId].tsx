import {
  Center,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
  Spacer,
  HStack,
  PinInput,
  PinInputField,
  Icon,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { CertificateProps, MachineProps } from "types/db";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import Router from "next/router";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { poster } from "services/poster";
import AdminLayout from "components/Layout/AdminLayout";
import MachineWidget from "components/Widget/MachineWidget";
import { User } from "next-auth";
import {
  PINLen,
  redBtn,
  responsiveHeaderFontSize,
  responsivePx,
  responsiveSubheaderFontSize,
  tealBtn,
} from "services/constants";
import { EditFAB } from "components/Layout/FAB/EditFAB";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiLogOut, FiTrash2 } from "react-icons/fi";

type PageProps = {
  user: User;
  machines: MachineProps[];
};

export default function UserPage(props: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const [isVisible, setIsVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //--new state--
  const [newPIN, setNewPIN] = useState(props.user.PIN ? props.user.PIN : "");
  const [newCerts, setNewCerts] = useState(props.user.certificates);
  //--handle relations--
  const inId = newCerts.map((cert) => cert.machineId);
  const outId = props.machines
    .map((item) => item.id)
    .filter((id) => !inId.includes(id));
  function addCert(certificate: CertificateProps) {
    const copy = [...newCerts];
    copy.push(certificate);
    setNewCerts(copy);
  }
  function rmCert(certificate: CertificateProps) {
    setNewCerts(newCerts.filter((t) => t.machineId != certificate.machineId));
  }
  //--handle delete modal--
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: props.user.id };
    const res = await poster("/api/delete-user", body, toaster, true);
    if (res.status == 200)
      await Router.push({ pathname: "/admin/manage-users" });
  };
  //--force log out--
  const handleLeave = async () => {
    const body = {
      machineName: props.user.using?.name,
    };
    const res = await poster("/api/post/leave-machine", body, toaster);
    if (res.status == 200) Router.reload();
  };
  //--save edits--
  const handleUpdate = async () => {
    const addCerts = newCerts.filter(
      (newCert) =>
        props.user.certificates.find(
          (oldCert) => oldCert.machineId == newCert.machineId
        ) == undefined
    );
    const rmCerts = props.user.certificates.filter(
      (oldCert) =>
        newCerts.find((newCert) => newCert.machineId == oldCert.machineId) ==
        undefined
    );
    const body = {
      id: props.user.id,
      newPIN,
      addCerts,
      rmCerts,
    };
    const res = await poster("/api/update-user", body, toaster, true);
    if (res.status == 200) {
      Router.push(`/admin/view-user/${props.user.id}`); //necessary to re-grab updated server data
      setIsEdit(false);
    }
  };
  //--ret--
  return (
    <AdminLayout me={me} loaded={status !== "loading"}>
      <Flex px={responsivePx}>
        <Center
          w="100%"
          wordBreak={"break-all"}
          fontSize={responsiveHeaderFontSize}
        >
          {props.user.name}
        </Center>
        <Spacer />
        <IconButton
          onClick={onOpen}
          {...redBtn}
          icon={<Icon as={FiTrash2} boxSize={5} />}
        />
        <ConfirmDeleteModal
          isOpen={isOpen}
          onClose={onClose}
          name={props.user.name}
          handleDelete={handleDelete}
        />
      </Flex>
      <Flex px={responsivePx}>
        <Center
          w="100%"
          wordBreak={"break-all"}
          fontSize={responsiveSubheaderFontSize}
          color="gray"
        >
          {props.user.email}
        </Center>
      </Flex>
      <Flex px={responsivePx}>
        <HStack spacing={["4px", "8px"]} maxW="100%" mx="auto">
          <PinInput
            onChange={(e) => setNewPIN(e)}
            value={!isVisible && !isEdit ? newPIN + "      " : newPIN}
            size={["sm", "md"]}
            mask={!isVisible}
          >
            {Array.from(Array(PINLen).keys()).map((key) => (
              <PinInputField
                key={key}
                pointerEvents={isEdit ? "auto" : "none"}
              />
            ))}
          </PinInput>
          <IconButton
            icon={isVisible ? <Icon as={FiEyeOff} /> : <Icon as={FiEye} />}
            {...tealBtn}
            onClick={() => setIsVisible(!isVisible)}
            isDisabled={isEdit}
            pointerEvents={isEdit ? "none" : "auto"}
          />
          <IconButton
            icon={<Icon as={FiLogOut} />}
            {...redBtn}
            onClick={async () => {
              const res = await poster(
                "/api/post/leave-machine",
                {
                  machineName: props.user.using?.name,
                },
                toaster,
                false,
                true
              );
              if (res.status == 200) {
                update();
                Router.push(`/admin/view-user/${props.user.id}`);
              }
            }}
            isDisabled={props.user.using == undefined}
          />
        </HStack>
      </Flex>
      <SearchView
        setIn={newCerts.map((cert) => {
          return {
            name:
              (cert.machine.name == props.user.using?.name ? 0 : 1) +
              cert.machine.name,
            widget: (
              <MachineWidget
                //all
                id={cert.machine.id}
                image={cert.machine.image}
                name={cert.machine.name}
                description={cert.machine.description}
                //cert
                type2={true}
                certUserId={props.user.id}
                issuerName={cert.issuer.name}
                issuerEmail={cert.issuer.email}
                note={cert.note}
                //functions + state
                isEdit={isEdit}
                inverted={false}
                using={cert.machine.name == props.user.using?.name}
                handleRemove={() => rmCert(cert)}
              />
            ),
          };
        })}
        setOut={outId.map((id) => {
          const machine =
            props.machines.find((x) => x.id == id) || props.machines[0];
          return {
            name: machine.name,
            widget: (
              <MachineWidget
                //all
                id={machine.id}
                name={machine.name}
                description={machine.description}
                image={machine.image}
                //state
                isEdit={isEdit}
                inverted={true}
                handleAdd={() =>
                  addCert({
                    recipient: props.user,
                    recipientId: props.user.id,
                    machine: machine,
                    machineId: machine.id,
                    //type2
                    note: "",
                    issuer: me,
                    issuerId: me!.id,
                  })
                }
              />
            ),
          };
        })}
        isEdit={false}
      />
      <EditFAB
        isEdit={isEdit}
        onEdit={() => {
          setIsEdit(true);
          setIsVisible(true);
        }}
        onSave={() => {
          handleUpdate();
          setIsVisible(false);
        }}
        onCancel={() => {
          setNewPIN(props.user.PIN);
          setNewCerts(props.user.certificates);
          setIsEdit(false);
          setIsVisible(false);
        }}
      />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await prisma.user.findUnique({
    where: {
      id: String(context.params?.userId),
    },
    include: {
      certificates: {
        include: {
          issuer: true,
          machine: true,
        },
      },
      using: true,
    },
  });
  if (user == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
  const machines = await prisma.machine.findMany();
  return {
    props: {
      user,
      machines,
    },
  };
};
