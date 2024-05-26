import { MutableRefObject } from "react";
import { boxWidth, ledRadius, boxHeight, ledHeight } from "./constants";

type LEDProps = {
  left: boolean;
  active: boolean;
  rref: MutableRefObject<any>;
};
export default function LED(props: LEDProps) {
  const red = ["#FEB2B2", "#F56565"];
  const green = ["#81E6D9", "#38B2AC"];
  return (
    <mesh
      ref={props.rref}
      position={[
        (props.left ? -1 : 1) * (boxWidth / 2) +
          (props.left ? 1 : -1) * ledRadius,
        boxHeight / 2 + ledHeight / 2,
        0,
      ]}
    >
      <cylinderGeometry args={[ledRadius, ledRadius, ledHeight]} />
      <meshStandardMaterial
        attach="material-0"
        emissive={props.left ? green[1] : red[1]}
        emissiveIntensity={props.active ? 2.1 : 1}
        toneMapped={false}
      />
      <meshStandardMaterial
        attach="material-1"
        emissive={props.left ? green[0] : red[0]}
        emissiveIntensity={props.active ? 1.8 : 1}
        toneMapped={false}
      />
    </mesh>
  );
}
