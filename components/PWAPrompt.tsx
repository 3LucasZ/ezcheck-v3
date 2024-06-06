"use client";
import { Box, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FiPlusSquare, FiX } from "react-icons/fi";
import { IoShareOutline } from "react-icons/io5";

export default function PWAPrompt() {
  const isIos =
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  console.log("isIos:", isIos);
  const isInStandaloneMode =
    "standalone" in window.navigator && window.navigator.standalone;
  console.log("isStandalone:", isInStandaloneMode);
  const isCancelled = localStorage.getItem("isCancelled") === "true";
  console.log("isCancelled:", isCancelled);
  const [invisible, setInvisible] = useState(
    !isIos || isInStandaloneMode || isCancelled
  );
  return (
    <Box
      pos="fixed"
      bottom={invisible ? "-80px" : "12px"}
      left="12px"
      right="12px"
      maxW="400px"
      mx="auto"
      //bg="gray.200"
      bg="white"
      borderColor={"gray.400"}
      borderWidth={"2px"}
      borderRadius={"xl"}
      px="2"
      py="1"
      zIndex={10000}
      transition={"all 0.05s linear"}
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
        and then click "Add to Homescreen"
        {/* {" "} */}
        {/* <Icon as={FiPlusSquare} boxSize={6} verticalAlign={"bottom"} pb="0px" /> */}
        .
      </Text>
      <Box
        w="20px"
        h="20px"
        bg="red.400"
        pos={"absolute"}
        top={"-10px"}
        right={"-10px"}
        borderRadius={"full"}
        alignItems={"center"}
        onClick={() => {
          setInvisible(!invisible);
          localStorage.setItem("isCancelled", "true");
        }}
      >
        <Icon
          as={FiX}
          color="white"
          position={"absolute"}
          m="auto"
          left={0}
          right={0}
          top={0}
          bottom={0}
        />
      </Box>
    </Box>
  );
}
