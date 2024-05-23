import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { successToast } from "services/toasty";

type PageProps = {
  onClose: () => void;
  isOpen: boolean;
  name: string;
  handleDelete: () => Promise<void>;
};
export default function ConfirmDeleteModal(props: PageProps) {
  const toaster = useToast();
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete {props.name}?</ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} colorScheme="teal">
            No
          </Button>
          <Button
            onClick={() => {
              successToast(toaster, "Success!");
              props.onClose();
              props.handleDelete();
            }}
            colorScheme="red"
            ml="2"
          >
            I am sure
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
