import type { NextApiRequest, NextApiResponse } from "next";
import { debugMode } from "./constants";

export function getIPFromReq(req: NextApiRequest) {
  console.log("headers", req.headers);
  console.log("socket.remoteAddress", req.socket.remoteAddress);
  var ip: string =
    (req.headers["x-real-ip"] as string) || req.socket.remoteAddress || "err";
  if (ip?.substring(0, 7) == "::ffff:") {
    ip = ip.substring(7);
  }
  if (debugMode) console.log("IP:", ip);
  return ip;
}

export function validEmail(email: string) {
  return (
    email.endsWith("@vcs.net") ||
    email.endsWith("@warriorlife.net") ||
    email.endsWith("@vvalley.org") ||
    email.endsWith("@thequestinstitute.com") ||
    email.endsWith("@q4excellence.com")
  );
}

export function formatClock(millis: number) {
  return new Date(millis * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function formatTimeSince(initMillis: number) {
  return (
    new Date(Date.now() - initMillis * 1000).getUTCHours() +
    " hrs " +
    new Date(Date.now() - initMillis * 1000).getUTCMinutes() +
    " mins"
  );
}
