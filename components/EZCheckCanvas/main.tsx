"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Flex } from "@chakra-ui/react";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { MutableRefObject, useRef, useState } from "react";
import { Mesh } from "three";
import { ToneMappingMode } from "postprocessing";

export function EZCheckCanvas() {
  const leftLEDRef = useRef<Mesh>(null!);
  const rightLEDRef = useRef<Mesh>(null!);
  return (
    <Flex h="100vh">
      <Canvas camera={{ zoom: 3 }}>
        {/* <color attach="background" args={["#111"]} /> */}

        <OrbitControls
          enableZoom={false}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        {/* <OrthographicCamera
          makeDefault
          zoom={2}
          top={2}
          bottom={-2}
          left={-2}
          right={2}
          position={[0, 0, 20]}
        /> */}
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
