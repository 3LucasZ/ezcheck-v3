import {
  VStack,
  Text,
  useBreakpointValue,
  HStack,
  Box,
} from "@chakra-ui/react";
import MachineWidget from "./MachineWidget";
import UserWidget from "./UserWidget";
import { MachineProps } from "types/db";

type InUseWidgetProps = {
  machine: MachineProps;
};
export default function InUseWidget(props: InUseWidgetProps) {
  const column =
    useBreakpointValue(
      {
        base: true,
        sm: true,
        md: false,
      },
      { fallback: "md", ssr: false }
    ) || false;

  const machine = (
    <MachineWidget
      id={props.machine.id}
      name={props.machine.name}
      description={props.machine.description}
      image={props.machine.image}
      forceMini
    />
  );
  const user = (
    <UserWidget
      id={props.machine.usedBy.id}
      name={props.machine.usedBy.name}
      email={props.machine.usedBy.email}
      image={props.machine.usedBy.image}
      forceMini
    />
  );
  const time = (
    <VStack minW="100px">
      <Text noOfLines={1}>
        {new Date(props.machine.lastLogin * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text fontSize={"xs"} color="gray.600" noOfLines={1}>
        {new Date(Date.now() - props.machine.lastLogin * 1000).getUTCHours() +
          " hrs " +
          new Date(
            Date.now() - props.machine.lastLogin * 1000
          ).getUTCMinutes() +
          " mins"}
      </Text>
    </VStack>
  );
  if (column) {
    return (
      <VStack minW="100%">
        <HStack minW="100%">
          {machine}
          {time}
        </HStack>
        <HStack minW="100%">
          <Box w="100px "></Box>
          {user}
        </HStack>
      </VStack>
    );
  } else {
    return (
      <HStack minW="100%">
        {machine}
        {user}
        {time}
      </HStack>
    );
  }
}
