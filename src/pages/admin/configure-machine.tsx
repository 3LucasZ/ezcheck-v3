import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  useToast,
  Text,
  Center,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

import AdminLayout from "components/Layout/AdminLayout";
import Router from "next/router";
import { useEffect, useState } from "react";
import { errorToast } from "services/toasty";

type PageProps = {
  queryName: string;
};
export default function Home({ queryName }: PageProps) {
  //--copy paste on every page--
  const { data: session, status, update } = useSession();
  /*
useEffect(() => {
    update();
  }, []);
*/
  const me = session?.user;
  const toaster = useToast();
  //--state--
  const [name, setName] = useState<string>(queryName);
  //--ret--
  return (
    <AdminLayout me={me} loaded={status !== "loading"}>
      <Flex
        flexDir="column"
        gap="10"
        overflowY="auto"
        px={[2, "5vw", "10vw", "15vw"]}
        pt={10}
        h="100%"
      >
        <FormControl isRequired>
          <FormLabel>Machine Name</FormLabel>
          <Input
            value={name}
            variant="filled"
            placeholder="Ex: Laser Cutter"
            onChange={(e) => setName(e.target.value)}
          />
          <FormHelperText>
            Name of an unregistered or registered machine.
          </FormHelperText>
        </FormControl>

        <Center>
          <Button
            //looks
            bg="orange.300"
            _hover={{ bg: "orange.400" }}
            transition={"background-color 0.3s"}
            color="white"
            size="lg"
            px="16"
            maxW="800px"
            //function
            isDisabled={name.length == 0}
            pointerEvents={name.length == 0 ? "none" : "auto"}
            type="submit"
            onClick={(e) => {
              e.preventDefault;
              if (!name) {
                errorToast(toaster, "Name can't be empty");
              } else {
                const url = "http://" + name.replaceAll(" ", "-") + ".local";
                console.log(url);
                Router.push(url);
              }
            }}
          >
            Start Configuring
          </Button>
        </Center>
        {name && (
          <>
            <Text>
              When you start configuring, you will be redirected to{" "}
              <Link color={"teal.500"}>
                {"http://" + name.replaceAll(" ", "-") + ".local"}
              </Link>
              .
            </Text>
            <Text>
              Make sure you are on Google Chrome (not Safari) web browser and on
              a computer. This has not been tested with other browsers or mobile
              devices.
            </Text>
            <Text>
              If the configuration page does not load, then the machine you are
              trying to access does not exist or is not on the same network as
              your device.
            </Text>
          </>
        )}
      </Flex>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  var { name } = context.query;
  if (name == null) name = "";
  return {
    props: {
      queryName: name,
    },
  };
};
