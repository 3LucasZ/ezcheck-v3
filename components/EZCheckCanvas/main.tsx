"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Flex } from "@chakra-ui/react";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { MutableRefObject, useRef } from "react";
import { Mesh } from "three";
import { ToneMappingMode } from "postprocessing";
import LED from "./LED";
import LCD from "./LCD";
import { boxWidth, boxHeight, boxDepth } from "./constants";
import Keypad from "./Keypad";

type FrameProps = {
  leftLEDRef: MutableRefObject<any>;
  rightLEDRef: MutableRefObject<any>;
};
function EZCheck(props: FrameProps) {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
      <meshBasicMaterial attach="material-0" color="#CBD5E0" />
      <meshBasicMaterial attach="material-1" color="#A0AEC0" />
      <meshBasicMaterial attach="material-2" color="#E2E8F0" />
      <meshBasicMaterial attach="material-3" color="#CBD5E0" />
      <meshBasicMaterial attach="material-4" color="#CBD5E0" />
      <meshBasicMaterial attach="material-5" color="#CBD5E0" />
      <LED left={true} active={true} rref={props.leftLEDRef} />
      <LED left={false} active={true} rref={props.rightLEDRef} />
      <LCD text={"12345678901234 1234567890"} />
      <Keypad />
    </mesh>
  );
}

export function EZCheckCanvas() {
  const leftLEDRef = useRef<Mesh>(null!);
  const rightLEDRef = useRef<Mesh>(null!);
  return (
    <Flex h="100vh">
      <Canvas camera={{ position: [0, 0, 3] }}>
        {/* <color attach="background" args={["#111"]} /> */}

        <OrbitControls
          enableZoom={false}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <EZCheck leftLEDRef={leftLEDRef} rightLEDRef={rightLEDRef} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            mipmapBlur
            luminanceThreshold={1}
            levels={8}
            intensity={0.4 * 4}
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
    </Flex>
  );
}
