import {
  Box,
  Divider,
  AbsoluteCenter,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

type PageProps = {
  color: string;
  icon: IconType;
  text: string;
};
export default function CustomDivider(props: PageProps) {
  return (
    <Box position="relative" py={8} px={2}>
      <Divider />
      <AbsoluteCenter bg="white">
        <HStack color={props.color} px="3">
          <Icon as={props.icon} boxSize={6} />
          <Text fontSize="xl">{props.text}</Text>
        </HStack>
      </AbsoluteCenter>
    </Box>
  );
}
