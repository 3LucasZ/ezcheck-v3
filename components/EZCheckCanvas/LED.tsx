import { MutableRefObject, useEffect, useState } from "react";
import {
  boxWidth,
  ledRadius,
  boxHeight,
  ledHeight,
  t_LEDOff,
  t_LEDOn,
} from "./constants";
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
  // useFrame(() => {
  //   //toggle per 500 ms
  //   if ((Date.now() - init) % (t_LEDOn + t_LEDOff) < t_LEDOn) {
  //     props.active && setOn(true);
  //   } else {
  //     setOn(false);
  //   }
  // });
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
        emissiveIntensity={props.active ? 2.1 : 1} //use "on" instead of props.active to animate
        toneMapped={true}
      />
      <meshStandardMaterial
        attach="material-1"
        emissive={props.left ? green[0] : red[0]}
        emissiveIntensity={props.active ? 1.8 : 1} //use "on" instead of props.active to animate
        toneMapped={true}
      />
    </mesh>
  );
}
