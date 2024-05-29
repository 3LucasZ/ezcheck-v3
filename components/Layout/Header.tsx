import { Divider, Heading, HStack, Link, Stack } from "@chakra-ui/react";
import React from "react";
import AvatarMenu from "./AvatarMenu";
import { User } from "next-auth";

type HeaderProps = {
  me?: User;
  noDivider?: boolean;
};
export default function Header({ me, noDivider }: HeaderProps) {
  return (
    <>
      <HStack
        minW="100vw"
        display={"flex"}
        flexDir="row"
        textAlign={"center"}
        py="1"
      >
        <Heading
          size={["xl"]}
          bgGradient={"linear(to-b, orange.200, red.300)"} //light
          bgClip={"text"}
          w="100%"
        >
          EZCheck
        </Heading>
        <AvatarMenu me={me} />
      </HStack>
      {!noDivider && <Divider />}
    </>
  );
}
