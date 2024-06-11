import {
  ButtonGroup,
  Center,
  Flex,
  Icon,
  IconButton,
  Switch,
  useDisclosure,
  useToast,
  Text,
  Box,
  HStack,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import SearchView from "components/SearchView";
import { useSession } from "next-auth/react";
import prisma from "services/prisma";
import { CertificateProps, MachineProps } from "types/db";
import AdminLayout from "components/Layout/AdminLayout";
import { poster } from "services/poster";
import UserWidget from "components/Widget/UserWidget";
import { EditFAB } from "components/Layout/FAB/EditFAB";
import { useEffect, useState } from "react";
import { redBtn, responsivePx, tealBtn } from "services/constants";
import EditableTitle from "components/Composable/EditableTitle";
import EditableSubtitle from "components/Composable/EditableSubtitle";
import { User } from "next-auth";
import { FiImage, FiSettings, FiTrash2 } from "react-icons/fi";
import ImageModal from "components/Main/ImageModal";
type PageProps = {
  machine: MachineProps;
  users: User[];
};
export default function MachinePage({ machine, users }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const [isEdit, setIsEdit] = useState(false);
  //--new state--
  const [newName, setNewName] = useState(machine.name);
  const [newDescription, setNewDescription] = useState(machine.description);
  const [newWebAuth, setNewWebAuth] = useState(machine.webAuth);
  const [newCerts, setNewCerts] = useState(machine.certificates);
  //--handle relations--
  const inId = newCerts.map((cert) => cert.recipientId);
  const outId = users.map((item) => item.id).filter((id) => !inId.includes(id));
  function addCert(certificate: CertificateProps) {
    const copy = [...newCerts];
    copy.push(certificate);
    setNewCerts(copy);
  }
  function rmCert(certificate: CertificateProps) {
    setNewCerts(
      newCerts.filter((t) => t.recipientId != certificate.recipientId)
    );
  }
  //--handle delete modal--
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDelete = async () => {
    const body = { id: machine.id };
    const res = await poster("/api/delete-machine", body, toaster, true);
    if (res.status == 200)
      await Router.push({ pathname: "/admin/manage-machines" });
  };
  //--handle view modal--
  const {
    isOpen: isOpenViewer,
    onOpen: onOpenViewer,
    onClose: onCloseViewer,
  } = useDisclosure();
  //--handle upload image--
  const uploadImage = async (newImage: string) => {
    //delete old image
    var body, res;
    body = { image: machine.image };
    res = await poster("/api/delete-image", body, toaster);
    if (res.status == 200) {
      //upload new image
      body = { image: newImage };
      res = await poster("/api/upload-image", body, toaster);
      const imageUrl = await res.json();
      if (res.status == 200) {
        //attach new image to item
        const body = { id: machine.id, image: imageUrl };
        const res = await poster("/api/update-machine-image", body, toaster);
        if (res.status == 200) {
          Router.reload();
        }
      }
    }
  };
  //--handle update machine
  const handleUpdate = async () => {
    const addCerts = newCerts.filter(
      (newCert) =>
        machine.certificates.find(
          (oldCert) => oldCert.recipientId == newCert.recipientId
        ) == undefined
    );
    const rmCerts = machine.certificates.filter(
      (oldCert) =>
        newCerts.find(
          (newCert) => newCert.recipientId == oldCert.recipientId
        ) == undefined
    );
    const body = {
      id: machine.id,
      newName,
      newDescription,
      newWebAuth,
      addCerts,
      rmCerts,
    };
    const res = await poster("/api/update-machine", body, toaster, true);
    if (res.status == 200) {
      Router.push(`/admin/view-machine/${machine.id}`);
      setIsEdit(false);
    }
  };
  //--ret--
  return (
    <AdminLayout me={me} loaded={status !== "loading"}>
      <Flex px={responsivePx}>
        <EditableTitle
          value={isEdit ? newName : machine.name}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewName(e.target.value)
          }
          isDisabled={!isEdit}
        />
        <Center>
          <ButtonGroup spacing="2" pl="2" isAttached>
            <IconButton
              colorScheme="blue"
              aria-label=""
              icon={<Icon as={FiImage} boxSize={5} />}
              onClick={() => {
                onOpenViewer();
              }}
            />
            <ImageModal
              onClose={onCloseViewer}
              isOpen={isOpenViewer}
              onUpload={uploadImage}
              canUpload={true}
              imageStr={machine.image}
            />
            <IconButton
              onClick={() =>
                Router.push({
                  pathname: "/admin/configure-machine",
                  query: { name: machine.name },
                })
              }
              sx={tealBtn}
              aria-label=""
              icon={<Icon as={FiSettings} boxSize={5} />}
            />

            <IconButton
              onClick={onOpen}
              sx={redBtn}
              aria-label="delete"
              icon={<Icon as={FiTrash2} boxSize={5} />}
            />
            <ConfirmDeleteModal
              isOpen={isOpen}
              onClose={onClose}
              name={" the machine: " + machine.name}
              handleDelete={handleDelete}
            />
          </ButtonGroup>
        </Center>
      </Flex>
      <Flex px={responsivePx}>
        <EditableSubtitle
          value={
            isEdit
              ? newDescription
              : machine.description
              ? machine.description
              : "No description."
          }
          onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
            setNewDescription(e.target.value)
          }
          isDisabled={!isEdit}
          placeholder="Description"
        />

        <HStack minW="128px">
          <Box w="1"></Box>
          <Text noOfLines={1}>Web Auth</Text>
          <Switch
            size="md"
            colorScheme="green"
            isChecked={newWebAuth}
            onChange={(e) => setNewWebAuth(e.target.checked)}
            disabled={!isEdit}
          />
        </HStack>
      </Flex>
      <SearchView
        setIn={newCerts.map((cert, index) => ({
          name:
            (cert.recipient.name == machine.usedBy?.name ? 0 : 1) +
            cert.recipient!.name,
          widget: (
            <UserWidget
              //all
              key={cert.recipient.id}
              id={cert.recipient.id}
              name={cert.recipient.name}
              email={cert.recipient.email}
              image={cert.recipient.image}
              index={index}
              //type2
              type2={true}
              certMachineId={machine.id}
              issuerName={cert.issuer.name}
              issuerEmail={cert.issuer.email}
              note={cert.note}
              //additive
              isEdit={isEdit}
              handleRm={() => rmCert(cert)}
              //meta
              using={cert.recipient.name == machine.usedBy?.name}
            />
          ),
        }))}
        setOut={outId.map((id, index) => {
          const user = users.find((x) => x.id == id) || users[0];
          return {
            name: user.name,
            widget: (
              <UserWidget
                //all
                key={user.id}
                id={user.id}
                name={user.name}
                email={user.email}
                image={user.image}
                index={index}
                //xtra
                inverted={true}
                isEdit={isEdit}
                handleAdd={() =>
                  addCert({
                    recipient: user,
                    recipientId: user.id,
                    machine: machine,
                    machineId: machine.id,
                    //
                    note: "",
                    issuer: session?.user,
                    issuerId: session?.user.id,
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
        }}
        onSave={handleUpdate}
        onCancel={() => {
          //reset all the states
          setNewName(machine.name);
          setNewDescription(machine.description);
          setNewWebAuth(machine.webAuth);
          setNewCerts(machine.certificates);
          setIsEdit(false);
        }}
      />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const machine = await prisma.machine.findUnique({
    where: {
      id: Number(context.params?.machineId),
    },
    include: {
      usedBy: true,
      certificates: {
        include: {
          recipient: true,
          issuer: true,
        },
      },
    },
  });
  //redirect if invalid id
  if (machine == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
  const users = await prisma.user.findMany({
    where: {
      // isAdmin: false,
    },
  });
  return {
    props: {
      machine,
      users,
    },
  };
};
