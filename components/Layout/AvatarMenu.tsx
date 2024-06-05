import {
  Avatar,
  AvatarBadge,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { User } from "next-auth";
import { signOut, signIn } from "next-auth/react";
import Router from "next/router";
import { FcGoogle } from "react-icons/fc";
import {
  FiActivity,
  FiBookOpen,
  FiNavigation,
  FiRefreshCcw,
  FiUsers,
} from "react-icons/fi";
import { debugMode } from "services/constants";

type AvatarMenuProps = {
  me?: User;
};

export default function AvatarMenu({ me }: AvatarMenuProps) {
  let badgeColor = "gray.400";
  let statusColor = "gray.300";
  let statusMsg = "Idle";
  if (me?.isSupervising) {
    badgeColor = "purple.400";
    statusColor = "purple.100";
    statusMsg = "Supervising";
  } else if (me?.using) {
    badgeColor = "green.400";
    statusColor = "green.100";
    statusMsg = "Machining";
  }

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
        <Text px={3} py={1.5} bg={statusColor}>
          Status: {statusMsg}
        </Text>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            me
              ? signOut({ callbackUrl: "/" })
              : signIn("google", { callbackUrl: "/main" });
          }}
        >
          <Icon as={FcGoogle} pr="2" boxSize={6} />
          {me ? "Sign out" : "Sign in"}
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={(e) => {
            Router.push("/");
          }}
        >
          <Icon as={FiNavigation} pr="2" boxSize={6} />
          Landing Page
        </MenuItem>
        {me?.isAdmin && (
          <MenuItem
            onClick={(e) => {
              Router.push("/admin/home");
            }}
          >
            <Icon as={FiActivity} pr="2" boxSize={6} />
            Admin Page
          </MenuItem>
        )}
        {me && (
          <MenuItem
            onClick={(e) => {
              Router.push("/user/home");
            }}
          >
            <Icon as={FiUsers} pr="2" boxSize={6} />
            User Page
          </MenuItem>
        )}
        {/* {me?.isAdmin && (
          <MenuItem
            onClick={(e) => {
              Router.push("/admin/manage-admin");
            }}
          >
            <Icon as={FiMonitor} pr="2" boxSize={6} />
            Admin Dashboard
          </MenuItem>
        )} */}
        <MenuItem
          onClick={(e) => {
            Router.reload();
          }}
        >
          <Icon as={FiRefreshCcw} pr="2" boxSize={6} />
          Refresh
        </MenuItem>
        {me && (
          <MenuItem
            onClick={(e) => {
              Router.push("/help");
            }}
          >
            <Icon as={FiBookOpen} pr="2" boxSize={6} />
            Help
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
