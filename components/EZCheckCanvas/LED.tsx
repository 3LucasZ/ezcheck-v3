import { MutableRefObject, useEffect, useState } from "react";
import { boxWidth, ledRadius, boxHeight, ledHeight } from "./constants";
import { useFrame } from "@react-three/fiber";

type LEDProps = {
  left: boolean;
  active: boolean;
  rref: MutableRefObject<any>;
};
export default function LED(props: LEDProps) {
  const red = ["#FEB2B2", "#F56565"];
  const green = ["#81E6D9", "#38B2AC"];
  const [on, setOn] = useState(false);
  const [init, setInit] = useState(0);
  useEffect(() => {
    setInit(Date.now());
  }, [props.active]);
  useFrame(() => {
    if ((Date.now() - init) % 1000 > 500) {
      props.active && setOn(true);
    } else {
      setOn(false);
    }
  });
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
        emissiveIntensity={on ? 2.1 : 1}
        toneMapped={false}
      />
      <meshStandardMaterial
        attach="material-1"
        emissive={props.left ? green[0] : red[0]}
        emissiveIntensity={on ? 1.8 : 1}
        toneMapped={false}
      />
    </mesh>
  );
}
