import { gray } from "services/constants";
import {
  lcdDepth,
  keyLen,
  keys,
  gridPad,
  gridLen,
  boxHeight,
  boxPad,
  boxDepth,
  keyDepth,
} from "./constants";
import { Text } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";

type KeyProps = {
  x: number;
  y: number;
  text: string;
  onClick: Function;
};
function Key(props: KeyProps) {
  return (
    <mesh
      position={[props.x, props.y, lcdDepth]}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick(props.text);
        // console.log(props.text);
      }}
    >
      <boxGeometry args={[keyLen, keyLen, keyDepth]} />
      <meshStandardMaterial attach={"material-0"} emissive={gray[6]} />
      <meshStandardMaterial attach={"material-1"} emissive={gray[7]} />
      <meshStandardMaterial attach={"material-2"} emissive={gray[5]} />
      <meshStandardMaterial attach={"material-3"} emissive={gray[6]} />
      <meshStandardMaterial attach={"material-4"} emissive={gray[6]} />
      <meshStandardMaterial attach={"material-5"} emissive={gray[6]} />
      <Text scale={[0.1, 0.1, 0.1]} position={[0, 0, keyDepth / 2 + 0.001]}>
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
    <mesh position={[0, -boxHeight / 2 + gridLen / 2 + boxPad, boxDepth / 2]}>
      <boxGeometry args={[gridLen, gridLen, lcdDepth]} />
      <meshStandardMaterial emissive={"#A0AEC0"} />
      {...ret}
    </mesh>
  );
}
