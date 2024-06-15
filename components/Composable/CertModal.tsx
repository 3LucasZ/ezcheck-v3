//COPY FROM EZFIND2
import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import { FiAward } from "react-icons/fi";
import EditableTitle from "./EditableTitle";
import { blueBtn, tealBtn } from "services/constants";
import { poster } from "services/poster";
import Router from "next/router";

type CertModalProps = {
  //certificate update
  machineId: number;
  recipientId: string;
  //else
  isEdit?: boolean;
  issuerName?: string;
  issuerEmail?: string;
  note?: string;
};
export default function CertModal(props: CertModalProps) {
  //state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newNote, setNewNote] = useState(props.note ? props.note : "");
  const toaster = useToast();
  //server
  const onUpdate = async () => {
    const res = await poster(
      "/api/update-cert",
      {
        machineId: props.machineId,
        recipientId: props.recipientId,
        newNote,
      },
      toaster,
      true
    );
    if (res.status == 200) {
      onClose();
      Router.reload();
    }
  };
  //ret
  return (
    <>
      <Icon
        //---color
        {...blueBtn}
        color="white"
        //---border
        rounded="xl"
        borderColor={"grey.200"}
        borderWidth={"1px"}
        //---display
        as={FiAward}
        boxSize={"10"}
        p="2.5"
        //---misc
        onClick={(e) => {
          e.stopPropagation(); //if parent element is clicked, it will be ignored, so that this action activates instead.
          onOpen();
        }}
      />
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setNewNote(props.note ? props.note : "");
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="orange.100" borderTopRadius={"md"}>
            <HStack>
              {/* <Icon color="green.400" as={FiCheckSquare} boxSize={6} /> */}
              <Text>Machine Certification</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton
          // color={"red.400"}
          />
          <ModalBody>{`Issued by: ${
            props.issuerName ? props.issuerName : "an expired admin"
          } (${props.issuerEmail ? props.issuerEmail : "N/A"})`}</ModalBody>
          <Box px="6">
            Note:
            <Box h="1" />
            <EditableTitle
              //ui
              fontSize={"md"}
              textAlign="left"
              px={2}
              //state
              value={
                props.isEdit
                  ? newNote
                  : props.note
                  ? props.note
                  : "Official Certification"
              }
              disabled={!props.isEdit}
              placeholder={"Ex: Mr. Huber CNC Training 5/21/24"}
              onChange={(e: {
                target: { value: React.SetStateAction<string> };
              }) => setNewNote(e.target.value)}
            />
          </Box>
          <ModalFooter>
            {props.isEdit && (
              <Button sx={tealBtn} onClick={onUpdate}>
                Update Note
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
