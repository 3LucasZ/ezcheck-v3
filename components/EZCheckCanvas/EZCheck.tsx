import { MutableRefObject, useState } from "react";
import { boxDepth, boxHeight, boxWidth, ledHeight } from "./constants";
import Keypad from "./Keypad";
import LCD from "./LCD";
import LED from "./LED";

type EZCheckProps = {
  leftLEDRef: MutableRefObject<any>;
  rightLEDRef: MutableRefObject<any>;
};
export default function EZCheck(props: EZCheckProps) {
  const [show, setShow] = useState("Welcome!");
  const [pass, setPass] = useState("");
  const [good, setGood] = useState<boolean | undefined>(undefined);

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
            setShow("PIN: " + pass.slice(0, -1));
          } else if (key == "*") {
            if (pass.length > 0) {
              const good = Math.random() < 0.5;
              if (good) {
                setGood(true);
                setShow("Authorized");
              } else {
                setGood(false);
                setShow("Denied access");
              }
              setPass("");
            } else {
              setShow("PIN: ");
            }
          } else if (key != "A" && key != "B" && key != "C" && key != "#") {
            const newPass = pass.length < 10 ? pass.concat(key) : pass;
            setPass(newPass);
            setShow("PIN: " + newPass);
          }
        }}
      />
    </mesh>
  );
}
