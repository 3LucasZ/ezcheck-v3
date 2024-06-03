import { Box, Heading, useBreakpointValue } from "@chakra-ui/react";
import { EZCheckCanvas } from "components/EZCheckCanvas/EZCheckView";
import Layout from "components/Layout/MainLayout";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Simulator() {
  const { data: session, status, update } = useSession();
  useEffect(() => {
    update();
  }, []);
  const user = session?.user;
  const useBloom = useBreakpointValue({
    base: false,
    sm: true,
  });
  return (
    <Layout authorized={true} loaded={status !== "loading"}>
      {/* <Header isAdmin={user?.isAdmin} /> */}

      <Heading
        textAlign={"center"}
        fontWeight={600}
        fontSize={["3xl", "4xl", "5xl"]}
        lineHeight={"110%"}
        bgGradient={"linear(to-r, orange.300, red.400)"}
        bgClip={"text"}
      >
        EZCheck Simulator
      </Heading>
      <Box h="80%">
        <EZCheckCanvas useBloom={useBloom}></EZCheckCanvas>
      </Box>
    </Layout>
  );
}
