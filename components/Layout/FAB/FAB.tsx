//COPY FROM EZFIND2
import {
  Icon,
  Text,
  HStack,
  ComponentWithAs,
  IconProps,
  Box,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

type FABProps = {
  onClick: Function;
  icon: IconType | ComponentWithAs<"svg", IconProps>;
  name?: string;
  bottomOffset?: number;
  hidden?: boolean;
  //style
  sx: any;
  boxSize?: number;
};

export const FAB = ({
  icon,
  onClick,
  name,
  bottomOffset,
  hidden,
  //style
  sx,
  boxSize,
}: FABProps) => {
  !bottomOffset && (bottomOffset = 0);
  return (
    <Box
      //---position/transition---
      position={"fixed"}
      right={"10px"}
      bottom={`calc(50px + 10px + ${bottomOffset}px + env(safe-area-inset-bottom))`}
      transition={"bottom 0.3s"}
    >
      <HStack
        //---sizing + spacing---
        minH="16"
        minW="16"
        maxW={name ? "" : "16"}
        py={name ? "3" : "auto"}
        px={name ? "6" : "auto"}
        //---looks---
        rounded="full"
        sx={sx}
        //---misc---
        onClick={(e) => onClick()}
        zIndex={4}
        hidden={hidden}
      >
        <Icon
          as={icon}
          boxSize={boxSize ? boxSize : "6"}
          p="0"
          m="0"
          w="100%"
        />
        <Text fontSize={"2xl"} hidden={name ? false : true}>
          {name}
        </Text>
      </HStack>
    </Box>
  );
};
