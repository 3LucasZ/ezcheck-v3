"use client";

import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Flex } from "@chakra-ui/react";
import { TextGeometry } from "three/examples/jsm/Addons.js";

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
};
function LED(props: LEDProps) {
  return (
    <mesh
      position={[
        (props.left ? -1 : 1) * (boxWidth / 2) +
          (props.left ? 1 : -1) * ledRadius,
        boxHeight / 2 + ledHeight / 2,
        0,
      ]}
    >
      <cylinderGeometry args={[ledRadius, ledRadius, ledHeight]} />
      <meshToonMaterial color={props.left ? "#FEB2B2" : "#81E6D9"} />
    </mesh>
  );
}
function Frame() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
      <meshToonMaterial color="var(--chakra-colors-orange-200);" />
      <LED left={true} />
      <LED left={false} />
      <mesh
        position={[0, boxHeight / 2 - lcdHeight / 2 - lcdPad, boxDepth / 2]}
      >
        <boxGeometry args={[lcdWidth, lcdHeight, lcdDepth]} />
        <meshToonMaterial color={"var(--chakra-colors-orange-200);"} />
        <Text
          scale={[0.1, 0.1, 0.1]}
          color="black" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={[0, 0, lcdDepth]}
        >
          HELLO WORLD
        </Text>
      </mesh>
      <mesh position={[0, -boxHeight / 2 + gridLen / 2 + lcdPad, boxDepth / 2]}>
        <boxGeometry args={[gridLen, gridLen, lcdDepth]} />
        <meshToonMaterial color={"#CCCCCC"} />
      </mesh>
    </mesh>
  );
}

export function EZCheck() {
  return (
    <Flex bg="black" h="100vh">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.1} />
        {/* <directionalLight color="white" position={[0, 0, 5]} /> */}
        <directionalLight color="white" position={[2, 2, 2]} />
        <mesh position={[2, 2, 2]}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
        <Frame />
      </Canvas>
    </Flex>
  );
}
