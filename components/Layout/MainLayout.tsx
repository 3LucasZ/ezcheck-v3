import Head from "next/head";
import { type ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import RedirectPage from "@/pages/404";

type LayoutProps = {
  // isAdmin: boolean | undefined;
  authorized: boolean;
  loaded: boolean;
  children?: ReactNode;
};
export default function Layout(props: LayoutProps) {
  //--set content based on: loaded, authorized--
  let content;
  if (props.loaded) {
    if (props.authorized) {
      content = props.children;
    } else {
      content = RedirectPage({
        errorCode: "403",
        msg1: "Forbidden",
        msg2: "You do not have permissions to view this page",
      });
    }
  } else {
    content = "";
  }
  //desparation CSS to stop overscrolling
  const css = `
  html, body {
    overscroll-behavior: none;
  }
  `;

  //--ret--
  return (
    <>
      <Head>
        <title>EZCheck</title>
        <meta name="description" content="Machine shop management system" />
        {/* ICON */}
        <link rel="icon" href="/icon/favicon.ico" />
        {/* #dev-only: trick to instantly refresh the favicon, using full pathname */}
        {/* <link rel="icon" href="https://localhost:3000/icon/favicon.ico" /> */}
        {/*PWA UI*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#fffffe" />
        {/*Enable PWA*/}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png"></link>
        {/*Forced CSS styling underlay*/}
        <style>{css}</style>
      </Head>
      <main>
        <Flex
          flexDir="column"
          overflow="hidden"
          // overscrollY="none"
          height={"100svh"}
          width={"100%"}
          position={"fixed"}
          sx={{
            userSelect: "none",
            touchAction: "none",
            // overscrollBehavior: "none",
            // WebkitOverflowScrolling: "touch",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            WebkitUserDrag: "none",
            WebkitTapHighlightColor: "rgba(0,0,0,0)",
          }}
        >
          {content}
        </Flex>
      </main>
    </>
  );
}

/*
  useEffect(() => {
    const html = document.querySelector("html") || new HTMLBodyElement();
    const body = document.querySelector("body") || new HTMLBodyElement();
    // html.style.overscrollBehavior = "none";
    html.style.touchAction = "none";
    body.style.touchAction = "none";
  });
  */
