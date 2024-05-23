//COPY FROM EZFIND2
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { AspectRatio, Icon, IconButton, useDisclosure } from "@chakra-ui/react";
import ConfirmActionModal from "components/Main/ConfirmActionModal";
import { MouseEventHandler } from "react";
import { FiHome, FiMinus, FiPlus, FiX } from "react-icons/fi";

type AddRemoveButtonProps = {
  //work
  isAdd?: boolean;
  invisible?: boolean;
  handleAdd?: Function;
  handleRemove?: Function;
  //confirmation
  askConfirmation?: boolean;
  actionStr?: string;
};
export default function AddRemoveButton({
  isAdd,
  invisible,
  handleAdd,
  handleRemove,
  askConfirmation,
  actionStr,
}: AddRemoveButtonProps) {
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
        as={isAdd ? FiPlus : FiX}
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
