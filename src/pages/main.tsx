import { useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";

export default function Main() {
  const { data: session, status, update } = useSession();

  const isAdmin = session?.user.isAdmin;

  useEffect(() => {
    update();
    Router.push(isAdmin ? "/admin/home" : "/user/home");
  });

  return "";
}
