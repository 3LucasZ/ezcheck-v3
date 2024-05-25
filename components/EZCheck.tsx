"use client";

import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Flex } from "@chakra-ui/react";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import {
  Bloom,
  EffectComposer,
  SelectiveBloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize, Resolution } from "postprocessing";
import { MutableRefObject, useRef } from "react";
import { AmbientLight, DirectionalLight, Light, Mesh } from "three";
import { ToneMappingMode } from "postprocessing";

const boxWidth = 1.13;
const boxHeight = 1.35;
const boxDepth = 0.5;

const ledRadius = boxDepth / 2 - 0.05;
const ledHeight = 0.2;

const lcdPad = 0.1;
const lcdWidth = boxWidth - 2 * lcdPad;
const lcdHeight = lcdWidth / 3;
const lcdDepth = 0.05;

// const gridLen = 0.75;
const gridLen = boxHeight - 3 * lcdPad - lcdHeight;

type LEDProps = {
  left: boolean;
  active: boolean;
  rref: MutableRefObject<any>;
};
function LED(props: LEDProps) {
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
        emissive={props.left ? red[1] : green[1]}
        emissiveIntensity={props.active ? 2 : 1}
        toneMapped={false}
      />
      <meshStandardMaterial
        attach="material-1"
        emissive={props.left ? red[0] : green[0]}
        emissiveIntensity={props.active ? 2 : 1}
        toneMapped={false}
      />
    </mesh>
  );
}
function LCD() {
  return (
    <mesh position={[0, boxHeight / 2 - lcdHeight / 2 - lcdPad, boxDepth / 2]}>
      <boxGeometry args={[lcdWidth, lcdHeight, lcdDepth]} />
      <meshStandardMaterial
        emissive={"#63B3ED"}
        emissiveIntensity={2}
        toneMapped={false}
      />
      <Text
        scale={[0.1, 0.1, 0.1]}
        color="" // default
        anchorX="center" // default
        anchorY="middle" // default
        position={[0, 0, lcdDepth]}
      >
        HELLO WORLD
      </Text>
    </mesh>
  );
}
function Keypad() {
  return (
    <mesh position={[0, -boxHeight / 2 + gridLen / 2 + lcdPad, boxDepth / 2]}>
      <boxGeometry args={[gridLen, gridLen, lcdDepth]} />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
}

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
      <LCD />
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
