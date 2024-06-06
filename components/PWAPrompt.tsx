import { Box, Icon, Text } from "@chakra-ui/react";
import { FiPlusSquare } from "react-icons/fi";
import { IoShareOutline } from "react-icons/io5";

export default function PWAPrompt() {
  return (
    <Box
      pos="fixed"
      bottom="8px"
      left="8px"
      right="8px"
      maxW="600px"
      mx="auto"
      //bg="gray.200"
      bg="white"
      borderColor={"gray.400"}
      borderWidth={"2px"}
      borderRadius={"xl"}
      px="2"
      py="1"
      zIndex={10000}
    >
      <Text>
        To install this webapp on your device: tap
        {/* {" "} */}
        <Icon
          as={IoShareOutline}
          color="#007AFF"
          boxSize={7}
          verticalAlign={"bottom"}
          pb="2px"
        />
        {/* {" "} */}
        and then scroll down to find Add to Homescreen
        {/* {" "} */}
        {/* <Icon as={FiPlusSquare} boxSize={6} verticalAlign={"bottom"} pb="0px" /> */}
        .
      </Text>
    </Box>
  );
}
