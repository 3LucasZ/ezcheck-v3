import { Text } from "@react-three/drei";
import {
  boxHeight,
  lcdHeight,
  boxPad,
  boxDepth,
  lcdWidth,
  lcdDepth,
  lcdPad,
} from "./constants";
type LCDProps = {
  text: string;
};
export default function LCD(props: LCDProps) {
  return (
    <mesh position={[0, boxHeight / 2 - lcdHeight / 2 - boxPad, boxDepth / 2]}>
      <boxGeometry args={[lcdWidth, lcdHeight, lcdDepth]} />
      <meshStandardMaterial
        emissive={"#81E6D9"}
        emissiveIntensity={1.54}
        toneMapped={false}
      />
      <Text
        scale={[0.11, 0.11, 0]}
        anchorX="left" // default
        anchorY="top" // default
        position={[-lcdWidth / 2 + lcdPad, lcdHeight / 2, lcdDepth]}
        maxWidth={lcdWidth}
      >
        {props.text}
        <meshStandardMaterial />
      </Text>
    </mesh>
  );
}
