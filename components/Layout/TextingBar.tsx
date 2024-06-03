import { Box, HStack, Icon, Input } from "@chakra-ui/react";
import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { orangeBtn } from "services/constants";

type TextingBarProps = {
  send: (query: string) => void;
};
export function TextingBar(props: TextingBarProps) {
  const [query, setQuery] = useState("");
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  return (
    <Box
      position={"fixed"}
      bottom={"60px"}
      left={0}
      right={0}
      mx="2"
      minH="60px"
      maxH="60px"
      zIndex={1000}
    >
      <HStack>
        <Input
          variant="outline"
          placeholder="Compose a new log message"
          rounded={"full"}
          minH="60px"
          w="100%"
          bg="white"
          onChange={handleSearchQueryChange}
          value={query}
        />
        <Box
          minH={"60px"}
          maxH={"60px"}
          minW={"60px"}
          maxW={"60px"}
          rounded="full"
          sx={orangeBtn}
          verticalAlign={"center"}
          onClick={(e) => {
            props.send(query);
            setQuery("");
          }}
        >
          <Icon aria-label={""} as={FiMessageCircle} p="4" w="100%" h="100%" />
        </Box>
      </HStack>
    </Box>
  );
}
