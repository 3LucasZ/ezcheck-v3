import {
  lcdDepth,
  keyLen,
  keys,
  gridPad,
  gridLen,
  boxHeight,
  boxPad,
  boxDepth,
} from "./constants";

type KeyProps = {
  x: number;
  y: number;
};
function Key(props: KeyProps) {
  return (
    <mesh position={[props.x, props.y, lcdDepth]}>
      <boxGeometry args={[keyLen, keyLen, lcdDepth]} />
      <meshStandardMaterial emissive={"#000000"} />
    </mesh>
  );
}
export default function Keypad() {
  const ret = [];
  for (let i = 0; i < keys.length; i++) {
    let x = (i % 4) * (gridPad + keyLen) - gridLen / 2 + keyLen / 2 + gridPad;
    let y =
      Math.floor(i / 4) * (gridPad + keyLen) -
      gridLen / 2 +
      keyLen / 2 +
      gridPad;
    ret.push(<Key x={x} y={y} />);
  }
  console.log(ret);
  return (
    <mesh position={[0, -boxHeight / 2 + gridLen / 2 + boxPad, boxDepth / 2]}>
      <boxGeometry args={[gridLen, gridLen, lcdDepth]} />
      <meshStandardMaterial emissive={"#A0AEC0"} />
      {...ret}
    </mesh>
  );
}
