import { ReactNode } from "react";
import Layout from "./MainLayout";
import Header from "./Header";
import { User } from "next-auth";

type LayoutProps = {
  me?: User;
  loaded: boolean;
  children: ReactNode;
};

export default function UserLayout({ me, loaded, children }: LayoutProps) {
  return (
    <Layout authorized={me != undefined} loaded={loaded}>
      <Header me={me} />
      {children}
    </Layout>
  );
}
