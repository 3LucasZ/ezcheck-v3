import {
  Avatar,
  AvatarBadge,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { User } from "next-auth";
import { signOut, signIn, useSession } from "next-auth/react";
import Router from "next/router";
import React from "react";
import { debugMode } from "services/constants";

type AvatarMenuProps = {
  me?: User;
};

export default function AvatarMenu({ me }: AvatarMenuProps) {
  let badgeColor = "gray.400";
  if (me?.isSupervising) badgeColor == "purple.500";
  else if (me?.using) badgeColor == "green.500";

  return (
    <Menu>
      <MenuButton pos="relative" float="right" right="2">
        <Avatar name={me?.name ? me.name : ""} src={me?.image ? me.image : ""}>
          <AvatarBadge boxSize="0.9em" bg={badgeColor} />
        </Avatar>
      </MenuButton>
      <MenuList textAlign="left">
        <Text px={3} py={1.5}>
          {me ? me.name : "Guest"}
        </Text>
        <Text px={3} py={1.5}>
          {me ? me.email : "You are not signed in"}
        </Text>
        <MenuDivider />
        <MenuItem
          onClick={(e) => {
            Router.push("/");
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            Router.push("/help");
          }}
        >
          Help
        </MenuItem>
        {me?.isAdmin && (
          <MenuItem
            onClick={(e) => {
              Router.push("/admin/manage-admin");
            }}
          >
            Admin Dashboard
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            if (debugMode) console.log(e);
            e.preventDefault();

            me
              ? signOut({ callbackUrl: "/" })
              : signIn("google", { callbackUrl: "/" });
          }}
        >
          {me ? "Sign out" : "Sign in"}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
