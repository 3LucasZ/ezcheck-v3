import { gray } from "services/constants";
import {
  keyLen,
  keys,
  gridPad,
  gridLen,
  boxHeight,
  boxPad,
  boxDepth,
  keyUpDepth,
  gridDepth,
  keyDownDepth,
} from "./constants";
import { Text } from "@react-three/drei";
import { useState } from "react";

type KeyProps = {
  x: number;
  y: number;
  text: string;
  onClick: Function;
};
function Key(props: KeyProps) {
  const [active, setActive] = useState(false);
  const trueKeyDepth = active ? keyDownDepth : keyUpDepth;
  return (
    <mesh
      position={[props.x, props.y, gridDepth / 2 + trueKeyDepth / 2]}
      onPointerDown={(e) => {
        e.stopPropagation();
        props.onClick(props.text);
        // console.log(props.text);
        setActive(true);
      }}
      onPointerUp={(e) => setActive(false)}
      onPointerLeave={(e) => setActive(false)}
      onPointerOut={(e) => setActive(false)}
    >
      <boxGeometry args={[keyLen, keyLen, trueKeyDepth]} />
      <meshStandardMaterial attach={"material-0"} emissive={gray[6]} />
      <meshStandardMaterial attach={"material-1"} emissive={gray[7]} />
      <meshStandardMaterial attach={"material-2"} emissive={gray[5]} />
      <meshStandardMaterial attach={"material-3"} emissive={gray[6]} />
      <meshStandardMaterial attach={"material-4"} emissive={gray[6]} />
      <meshStandardMaterial attach={"material-5"} emissive={gray[6]} />
      <Text scale={[0.1, 0.1, 0.1]} position={[0, 0, trueKeyDepth / 2 + 0.001]}>
        {props.text}
      </Text>
    </mesh>
  );
}
type KeypadProps = {
  onClick: Function;
};
export default function Keypad(props: KeypadProps) {
  const ret = [];
  for (let i = 0; i < keys.length; i++) {
    let x =
      Math.floor(i % 4) * (gridPad + keyLen) -
      gridLen / 2 +
      keyLen / 2 +
      gridPad;
    let y =
      (3 - Math.floor(i / 4)) * (gridPad + keyLen) -
      gridLen / 2 +
      keyLen / 2 +
      gridPad;
    ret.push(
      <Key
        x={x}
        y={y}
        text={keys[i]}
        onClick={(character: string) => props.onClick(character)}
      />
    );
  }
  return (
    <mesh
      position={[
        0,
        -boxHeight / 2 + gridLen / 2 + boxPad,
        boxDepth / 2 + gridDepth / 2,
      ]}
    >
      <boxGeometry args={[gridLen, gridLen, gridDepth]} />
      <meshStandardMaterial attach={"material-0"} emissive={gray[4]} />
      <meshStandardMaterial attach={"material-1"} emissive={gray[5]} />
      <meshStandardMaterial attach={"material-2"} emissive={gray[3]} />
      <meshStandardMaterial attach={"material-3"} emissive={gray[3]} />
      <meshStandardMaterial attach={"material-4"} emissive={gray[4]} />
      <meshStandardMaterial attach={"material-5"} emissive={gray[4]} />
      {...ret}
    </mesh>
  );
}
