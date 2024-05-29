import { Alert, AlertIcon, Box, Grid } from "@chakra-ui/react";

export type LogProps = {
  id: number;
  sender: string;
  timestamp: number;
  message: string;
  level: number;
};
type LogWidgetProps = {
  log: LogProps;
};

export default function LogWidget({ log }: LogWidgetProps) {
  return (
    <Alert
      status={log.level == 0 ? "info" : log.level == 1 ? "warning" : "error"}
      roundedRight="md"
      variant="left-accent"
      overflow="visible" //extremely important to keep styling right
    >
      <AlertIcon />
      <Box flexDir="column">
        <Box>{log.timestamp}</Box>
        <Box>{log.message}</Box>
      </Box>
    </Alert>
  );
}
