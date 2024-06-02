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
  students: User[];
};

export default function ManageStudents({ students }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const [email, setEmail] = useState("");
  //--registration--
  const preregister = async () => {
    const res = await poster(
      "/api/preregister-student",
      { email },
      toaster,
      true
    );
    if (res.status == 200) {
      Router.push("/admin/manage-students");
      onClose();
    }
  };
  const withMail = async () => {
    const res1 = await poster(
      "/api/preregister-student",
      { email },
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
        Router.push("/admin/manage-students");
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
        Students
      </Text>
      <SearchView
        setIn={students.map((student) => ({
          name: student.name,
          widget: (
            <UserWidget
              key={student.id}
              id={student.id}
              name={student.name}
              email={student.email}
              image={student.image}
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
              Students can create their own accounts via the EZCheck website. In
              addition, you can also preregister student accounts here.
            </Text>
            <Box h="4"></Box>
            <Text>
              Enter the email address of the student you want to preregister.
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
  const students = await prisma.user.findMany({
    // where: { isAdmin: false },
    include: { using: true },
  });
  return {
    props: { students },
  };
};
