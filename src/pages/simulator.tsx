import { Heading } from "@chakra-ui/react";
import { EZCheckCanvas } from "components/EZCheckCanvas/EZCheckView";
import Header from "components/Layout/Header";
import Layout from "components/Layout/MainLayout";
import { useSession } from "next-auth/react";

export default function Simulator() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Layout>
      {/* <Header isAdmin={user?.isAdmin} /> */}
      <Heading
        textAlign={"center"}
        fontWeight={600}
        fontSize={["3xl", "4xl", "5xl"]}
        lineHeight={"110%"}
        bgGradient={"linear(to-r, orange.300, red.400)"}
        bgClip={"text"}
      >
        EZ-Check Simulator
      </Heading>
      <EZCheckCanvas useBloom={true}></EZCheckCanvas>
    </Layout>
  );
}
