import {
  Box,
  Grid,
  HStack,
  Image,
  VStack,
  Text,
  AspectRatio,
  Stack,
  Show,
  useBreakpointValue,
} from "@chakra-ui/react";

import Router from "next/router";
import { genGradient } from "services/gradientGenerator";

import AddRemoveButton from "components/Composable/AddRemoveButton";
import { ChangeEventHandler } from "react";
import WidgetTitles from "./WidgetTitles";
import InOutButton from "components/Composable/InOutButton";

type MachineWidgetProps = {
  //data
  name: string;
  description?: string;
  image: string;
  url?: string;

  type2?: boolean;
  name2?: string;
  email2?: string;

  //state
  inverted?: boolean;
  isEdit?: boolean;
  using?: boolean;
  inUse?: boolean;
  webAuth?: boolean;

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
    if (props.url) hoverBg = "orange.200";
    else hoverBg = "orange.100";
  } else if (props.inUse) {
    bg = "red.100";
    if (props.url) hoverBg = "red.200";
    else hoverBg = "red.100";
  } else {
    if (props.url) hoverBg = "gray.100";
  }
  //columns
  const column =
    useBreakpointValue(
      {
        base: true,
        sm: true,
        md: false,
      },
      { fallback: "md", ssr: false }
    ) || false;
  const content = props.type2 ? (
    <HStack w="100%">
      <WidgetTitles
        title={props.name}
        subtitle={
          props.description != "" ? props.description : "No description."
        }
        column={true}
      />
      <WidgetTitles
        title={props.name2 ? props.name2 : "Expired admin"}
        subtitle={props.email2 ? props.email2 : "Expired email"}
        column={true}
      />
    </HStack>
  ) : (
    <WidgetTitles
      title={props.name}
      subtitle={props.description != "" ? props.description : "No description."}
      column={column}
    ></WidgetTitles>
  );

  return (
    <Box
      overflow={"hidden"}
      rounded="md"
      boxShadow={"md"}
      mx={1} //so we can see the side shadows
      onClick={() => props.url && Router.push(props.url)}
      pr="2"
      bg={bg}
      _hover={{
        bg: hoverBg,
      }}
      minH="60px"
      w="100%"
    >
      <HStack>
        <AspectRatio minW="60px" ratio={1} bgGradient={genGradient(props.name)}>
          <Image
            src={`/api/${props.image}`}
            hidden={props.image.length < 5}
          ></Image>
        </AspectRatio>
        {content}
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
