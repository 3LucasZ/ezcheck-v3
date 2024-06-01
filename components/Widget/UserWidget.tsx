import {
  Box,
  HStack,
  Image,
  Text,
  AspectRatio,
  Stack,
  Select,
  useDisclosure,
  useBreakpointValue,
  Avatar,
} from "@chakra-ui/react";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import { UserCardModal } from "components/Main/UserCardModal";
import Router from "next/router";
import WidgetTitles from "./WidgetTitles";
import CertModal from "components/Composable/CertModal";

type UserWidgetProps = {
  //all
  id: string;
  name: string;
  email?: string;
  image: string;

  //certificate
  type2?: boolean;
  certMachineId?: number;
  issuerName?: string;
  issuerEmail?: string;
  note?: string;

  //admin widgets
  isSupervising?: boolean;

  //additive widgets
  askConfirmation?: boolean; //only for admin add/rm
  handleAdd?: Function;
  handleRm?: Function;

  //states
  inverted?: boolean;
  isEdit?: boolean;
  using?: boolean;
  disabled?: boolean;
  forceMini?: boolean;
};

export default function UserWidget(props: UserWidgetProps) {
  const column = props.forceMini
    ? true
    : useBreakpointValue(
        {
          base: true,
          sm: false,
        },
        { fallback: "md", ssr: false }
      ) || false;

  return (
    <>
      <Box
        overflow={"hidden"}
        rounded="md"
        boxShadow={"md"}
        mx={1} //so we can see the side shadows
        onClick={() =>
          !(props.disabled || props.isEdit) &&
          Router.push(`/admin/view-student/${props.id}`)
        }
        px="2"
        bg={props.using ? "orange.100" : "white"}
        _hover={{
          bg:
            !(props.disabled || props.isEdit) &&
            (props.using ? "orange.200" : "gray.100"),
        }}
        minH="60px"
        w="100%"
      >
        <HStack h="60px">
          {/* <AspectRatio minW="45px" maxW="45px" ratio={1}>
            <Image
              src={props.image} //pfp stored on google servers, will NOT use our API
              // fallbackSrc="https://via.placeholder.com/150"
              hidden={props.image?.length < 5}
              borderRadius="full"
            ></Image>
          </AspectRatio> */}
          <Avatar name={props.name} src={props.image}></Avatar>
          <WidgetTitles
            title={props.name}
            subtitle={props.email}
            column={column}
          ></WidgetTitles>
          {props.type2 && (
            <CertModal
              //server
              machineId={props.certMachineId ? props.certMachineId : -100}
              recipientId={props.id}
              //view
              issuerName={props.issuerName}
              issuerEmail={props.issuerEmail}
              note={props.note ? props.note : ""}
              isEdit={props.isEdit}
            />
          )}
          {(props.handleAdd || props.handleRm) && (
            <AddRemoveButton
              isAdd={props.inverted}
              invisible={!props.isEdit}
              handleAdd={props.handleAdd!}
              handleRemove={props.handleRm!}
              askConfirmation={props.askConfirmation}
              actionStr={
                (!props.inverted
                  ? "revoke admin priveleges from "
                  : "grant admin priveleges to ") +
                `${props.name} (${props.email})`
              }
            />
          )}
        </HStack>
      </Box>
    </>
  );
}
