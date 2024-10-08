//COPY FROM EZFIND2
import { Icon, useDisclosure } from "@chakra-ui/react";

import { FiLogIn, FiLogOut } from "react-icons/fi";
import ConfirmActionModal from "../Main/ConfirmActionModal";

type InOutButtonProps = {
  //work
  isAdd?: boolean;
  invisible?: boolean;
  handleAdd?: Function;
  handleRemove?: Function;
  //confirmation
  askConfirmation?: boolean;
  actionStr?: string;
};
export default function InOutButton({
  isAdd,
  invisible,
  handleAdd,
  handleRemove,
  askConfirmation,
  actionStr,
}: InOutButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const action = () =>
    isAdd ? handleAdd && handleAdd() : handleRemove && handleRemove();
  return (
    <>
      <Icon
        //---color
        bg="white"
        transition=""
        _hover={{ bg: isAdd ? "teal.300" : "red.400", color: "white" }}
        color="black"
        //---border
        rounded="xl"
        borderColor={"grey.200"}
        borderWidth={"1px"}
        //---display
        as={isAdd ? FiLogIn : FiLogOut}
        opacity={invisible ? 0 : 1}
        boxSize={"10"}
        p="2.5"
        //---misc
        onClick={(e) => {
          e.stopPropagation(); //if parent element is clicked, it will be ignored, so that this action activates instead.
          askConfirmation ? onOpen() : action();
        }}
        aria-label={""}
      />
      <ConfirmActionModal
        isOpen={isOpen}
        onClose={onClose}
        protectedAction={action}
        actionStr={actionStr}
      />
    </>
  );
}
