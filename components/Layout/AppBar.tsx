import { Box, Center, HStack, Icon } from "@chakra-ui/react";

import { IconType } from "react-icons";
import Router from "next/router";
import {
  FiCpu,
  FiFileText,
  FiHome,
  FiMonitor,
  FiTool,
  FiUsers,
} from "react-icons/fi";

export default function AppBar() {
  return (
    <Box position="fixed" bottom="0" w="100%">
      <HStack gap={0} h={`calc(50px + env(safe-area-inset-bottom))`}>
        <AppBarBtn icon={FiHome} href="/admin/home" />
        <AppBarBtn icon={FiMonitor} href="/admin/manage-admin" />
        <AppBarBtn icon={FiUsers} href="/admin/manage-users" />
        <AppBarBtn icon={FiCpu} href="/admin/manage-machines" />
        <AppBarBtn icon={FiFileText} href="/admin/view-logs" />
        <AppBarBtn icon={FiTool} href="/admin/configure-machine" />
      </HStack>
    </Box>
  );
}

type AppBarBtnProps = {
  icon: IconType;
  href: string;
};
function AppBarBtn({ icon, href }: AppBarBtnProps) {
  return (
    <Box
      w={"100%"}
      h={"100%"}
      aria-label={""}
      pt="13px"
      onClick={() => Router.push(href)}
      style={{ textDecoration: "none" }}
      sx={{
        WebkitUserDrag: "none",
      }}
      bgGradient="linear(to-b, orange.200, red.300)"
      color="white"
      _hover={{ color: "red.400" }}
    >
      {
        <Center>
          <Icon as={icon} boxSize={6} />
        </Center>
      }
    </Box>
  );
}
