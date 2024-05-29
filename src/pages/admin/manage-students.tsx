import SearchView from "components/SearchView";
import { GetServerSideProps } from "next";
import prisma from "services/prisma";
import { useSession } from "next-auth/react";
import AdminLayout from "components/Layout/AdminLayout";
import UserWidget from "components/Widget/UserWidget";
import { User } from "next-auth";
import { responsiveHeaderFontSize } from "services/constants";
import { Text } from "@chakra-ui/react";

type PageProps = {
  students: User[];
};

export default function ManageStudents({ students }: PageProps) {
  //--copy paste on every page--
  const { data: session, status } = useSession();
  const me = session?.user;
  //--ret--
  return (
    <AdminLayout me={me}>
      <Text fontSize={responsiveHeaderFontSize} textAlign={"center"}>
        Students
      </Text>
      <SearchView
        setIn={students.map((student) => ({
          name: student.name,
          widget: (
            <UserWidget
              key={student.id}
              id={student.id}
              name={student.name}
              email={student.email}
              image={student.image}
            />
          ),
        }))}
        isEdit={true}
      />
    </AdminLayout>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const students = await prisma.user.findMany({
    // where: { isAdmin: false },
    include: { using: true },
  });
  return {
    props: { students },
  };
};
