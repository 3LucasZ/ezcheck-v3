import Head from "next/head";
import { useEffect, type ReactNode } from "react";
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
    // content = "";
    content = props.children;
  }
  //desparation CSS to stop overscrolling
  const css = `
  html, body {
    overscroll-behavior: none;
  }
  `;

  //desparation JS to stop zooming
  if (typeof window !== "undefined") {
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
      // @ts-expect-error
      document.body.style.zoom = 1;
    });

    document.addEventListener("gesturechange", function (e) {
      e.preventDefault();
      // @ts-expect-error
      document.body.style.zoom = 1;
    });
    document.addEventListener("gestureend", function (e) {
      e.preventDefault();
      // @ts-expect-error
      document.body.style.zoom = 1;
    });
  }

  //--ret--
  return (
    <>
      <Head>
        {/*Basics*/}
        <title>EZCheck</title>
        <meta name="description" content="Machine shop management system" />
        {/*Viewport*/}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        {/*PWA*/}
        <meta name="theme-color" content="#fffffe" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        {/*Icons*/}
        <link rel="icon" href="/icon/favicon.ico" />
        {/* #dev-only: trick to instantly refresh the favicon, using full pathname */}
        {/* <link rel="icon" href="https://localhost:3000/icon/favicon.ico" /> */}
        <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png"></link>
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2732-2048.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1668-2388.jpg"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2388-1668.jpg"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1536-2048.jpg"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2048-1536.jpg"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1488-2266.jpg"
          media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2266-1488.jpg"
          media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1640-2360.jpg"
          media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2360-1640.jpg"
          media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1668-2224.jpg"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2224-1668.jpg"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1620-2160.jpg"
          media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2160-1620.jpg"
          media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1290-2796.jpg"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2796-1290.jpg"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1179-2556.jpg"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2556-1179.jpg"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1284-2778.jpg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2778-1284.jpg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1170-2532.jpg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2532-1170.jpg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2436-1125.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1242-2688.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2688-1242.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-828-1792.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1792-828.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1242-2208.jpg"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-2208-1242.jpg"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-750-1334.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1334-750.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-640-1136.jpg"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="public/splashscreens/apple-splash-1136-640.jpg"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
        />
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
