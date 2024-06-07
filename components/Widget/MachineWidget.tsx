import { Box, HStack, AspectRatio, useBreakpointValue } from "@chakra-ui/react";
import Image from "next/image";

import Router from "next/router";
import { genGradient } from "services/gradientGenerator";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import WidgetTitles from "./WidgetTitles";
import InOutButton from "components/Composable/InOutButton";
import CertModal from "components/Composable/CertModal";

type MachineWidgetProps = {
  //all
  id: number;
  name: string;
  description?: string;
  image: string;

  //certificate
  type2?: boolean;
  certUserId?: string;
  issuerName?: string;
  issuerEmail?: string;
  note?: string;

  //state
  disabled?: boolean;
  inverted?: boolean;
  isEdit?: boolean;
  using?: boolean;
  inUse?: boolean;
  webAuth?: boolean;
  forceMini?: boolean;

  //functions
  handleLogin?: Function;
  handleLogout?: Function;
  handleAdd?: Function;
  handleRemove?: Function;
};

export default function MachineWidget(props: MachineWidgetProps) {
  //colors
  let bg = "white";
  let hoverBg = "white";
  if (props.using) {
    bg = "orange.100";
    if (!props.disabled && !props.isEdit) hoverBg = "orange.200";
    else hoverBg = "orange.100";
  } else if (props.inUse) {
    bg = "red.100";
    if (!props.disabled && !props.isEdit) hoverBg = "red.200";
    else hoverBg = "red.100";
  } else {
    if (!props.disabled && !props.isEdit) hoverBg = "gray.100";
  }

  //column
  let column =
    useBreakpointValue(
      {
        base: true,
        sm: false,
      },
      { fallback: "md", ssr: false }
    ) || false;
  if (props.forceMini) column = true;

  return (
    <Box
      overflow={"hidden"}
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() =>
        !props.disabled &&
        !props.isEdit &&
        Router.push(`/admin/view-machine/${props.id}`)
      }
      pr="2"
      bg={bg}
      _hover={{
        bg: hoverBg,
      }}
      minH="60px"
      w="100%"
    >
      <HStack>
        {/* <AspectRatio minW="60px" ratio={1} bgGradient={genGradient(props.name)}>
          <Image
            src={props.image.length > 5 ? `/api/${props.image}` : ""}
            hidden={props.image.length < 5}
          ></Image>
        </AspectRatio> */}
        <AspectRatio minW="60px" ratio={1} bgGradient={genGradient(props.name)}>
          {props.image.length > 5 ? (
            <Image
              loader={({ src, width, quality }) => {
                return `/api/${src}`;
              }}
              src={`${props.image}`}
              width={60}
              height={60}
              alt="mach"
              hidden={props.image.length < 5}
            />
          ) : (
            <></>
          )}
        </AspectRatio>
        <WidgetTitles
          title={props.name}
          subtitle={
            props.description != "" ? props.description : "No description."
          }
          column={column}
        ></WidgetTitles>
        {props.type2 && (
          <CertModal
            //server
            recipientId={props.certUserId ? props.certUserId : "BAD_ID"}
            machineId={props.id}
            //view
            issuerName={props.issuerName}
            issuerEmail={props.issuerEmail}
            note={props.note ? props.note : ""}
            isEdit={props.isEdit}
          />
        )}
        {(props.handleAdd || props.handleRemove) && (
          <AddRemoveButton
            isAdd={props.inverted}
            invisible={!props.isEdit}
            handleAdd={props.handleAdd!}
            handleRemove={props.handleRemove!}
          />
        )}
        {props.webAuth && (
          <InOutButton
            invisible={(!props.using && props.inUse) || props.inverted}
            isAdd={!props.using}
            handleAdd={props.handleLogin}
            handleRemove={props.handleLogout}
          />
        )}
      </HStack>
    </Box>
  );
}
