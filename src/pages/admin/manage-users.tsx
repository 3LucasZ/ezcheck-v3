import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import AdminLayout from "components/Layout/AdminLayout";
import UserWidget from "components/Widget/UserWidget";
import { User } from "next-auth";
import { orangeBtn, responsiveHeaderFontSize } from "services/constants";
import {
  Box,
  Button,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FAB } from "components/Layout/FAB/FAB";
import { FiMail, FiPlus, FiUserPlus } from "react-icons/fi";
import { poster } from "services/poster";
import Router from "next/router";

type PageProps = {
  users: User[];
};

export default function ManageUsers({ users }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  /*
useEffect(() => {
    update();
  }, []);
*/
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const [email, setEmail] = useState("");
  //--registration--
  const preregister = async () => {
    const res = await poster("/api/preregister-user", { email }, toaster, true);
    if (res.status == 200) {
      Router.push("/admin/manage-users");
      onClose();
    }
  };
  const withMail = async () => {
    const res1 = await poster(
      "/api/preregister-user",
      { email, restrict: true },
      toaster,
      false
    );
    if (res1.status == 200) {
      const res2 = await poster(
        "/api/preregister-send-email",
        { receiverEmail: email, senderEmail: me?.email, senderName: me?.name },
        toaster,
        true
      );
      if (res2.status == 200) {
        Router.push("/admin/manage-users");
        onClose();
      }
    }
  };
  //--pre-register modal--
  const { isOpen, onOpen, onClose } = useDisclosure();
  //--ret--
  return (
    <AdminLayout me={me} loaded={status !== "loading"}>
      <Text fontSize={responsiveHeaderFontSize} textAlign={"center"}>
        Users
      </Text>
      <SearchView
        setIn={users.map((user) => ({
          name: user.name,
          widget: (
            <UserWidget
              key={user.id}
              id={user.id}
              name={user.name}
              email={user.email}
              image={user.image}
            />
          ),
        }))}
        isEdit={true}
      />
      <FAB onClick={onOpen} icon={FiUserPlus} sx={orangeBtn} boxSize={7} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Preregistration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Users can create their own accounts via the EZCheck website. In
              addition, you can also preregister user accounts here.
            </Text>
            <Box h="4"></Box>
            <Text>
              Enter the email address of the user you want to preregister.
            </Text>
            <Box h="4"></Box>
            <Input
              placeholder="Ex: john.doe@warriorlife.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={preregister}>
              Preregister <Icon as={FiPlus} ml={2} boxSize={5} />
            </Button>
            <Button onClick={withMail}>
              Include invitation <Icon as={FiMail} ml={2} boxSize={5} />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany({
    // where: { isAdmin: false },
    include: { using: true },
  });
  return {
    props: { users },
  };
};
