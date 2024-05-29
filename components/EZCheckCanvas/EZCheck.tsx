import { MutableRefObject, useState } from "react";
import { boxDepth, boxHeight, boxWidth, ledHeight } from "./constants";
import Keypad from "./Keypad";
import LCD from "./LCD";
import LED from "./LED";
import { useFrame } from "@react-three/fiber";

type EZCheckProps = {
  leftLEDRef: MutableRefObject<any>;
  rightLEDRef: MutableRefObject<any>;
};
export default function EZCheck(props: EZCheckProps) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState("");
  const [pass, setPass] = useState("");
  const [good, setGood] = useState<boolean | undefined>(undefined);

  const initShow = "Welcome!";
  useFrame(({ clock }) => {
    const dt = Math.round(clock.getElapsedTime() * 1000); //milliseconds since page loaded
    //animate words (initial)
    const nxt = Math.round(dt / 500);
    let nextMsg = msg;
    if (nxt <= initShow.length) nextMsg = initShow.substring(0, nxt);
    //animate words (type setter effect)
    if (Math.round(dt / 250) % 2 == 0 && good == undefined) {
      setShow(nextMsg + ""); //you can set this character to an l, I, |, but it ends up looking kinda ugly.
    } else {
      setShow(nextMsg);
    }
    setMsg(nextMsg);
  });

  return (
    <mesh position={[0, -ledHeight / 2, 0]}>
      <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
      <meshBasicMaterial attach="material-0" color="#CBD5E0" />
      <meshBasicMaterial attach="material-1" color="#A0AEC0" />
      <meshBasicMaterial attach="material-2" color="#E2E8F0" />
      <meshBasicMaterial attach="material-3" color="#CBD5E0" />
      <meshBasicMaterial attach="material-4" color="#CBD5E0" />
      <meshBasicMaterial attach="material-5" color="#CBD5E0" />
      <LED
        left={true}
        active={good != undefined ? good : false}
        rref={props.leftLEDRef}
      />
      <LED
        left={false}
        active={good != undefined ? !good : false}
        rref={props.rightLEDRef}
      />
      <LCD text={show} />
      <Keypad
        onClick={(key: string) => {
          setGood(undefined);
          if (key == "D") {
            setPass(pass.slice(0, -1));
            setMsg("PIN: " + pass.slice(0, -1));
          } else if (key == "*") {
            if (pass.length > 0) {
              const good = Math.random() < 0.5;
              if (good) {
                setGood(true);
                setMsg("Authorized");
              } else {
                setGood(false);
                setMsg("Denied access");
              }
              setPass("");
            } else {
              setMsg("PIN: ");
            }
          } else if (key != "A" && key != "B" && key != "C" && key != "#") {
            const newPass = pass.length < 10 ? pass.concat(key) : pass;
            setPass(newPass);
            setMsg("PIN: " + newPass);
          } else {
            setMsg("PIN: " + pass);
          }
        }}
      />
    </mesh>
  );
}
