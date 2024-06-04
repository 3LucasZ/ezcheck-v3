"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { ToneMappingMode } from "postprocessing";
import EZCheck from "./EZCheck";
import { ledHeight } from "./constants";

type PageProps = {
  useBloom?: boolean;
};
export function EZCheckCanvas(props: PageProps) {
  const leftLEDRef = useRef<Mesh>(null!);
  const rightLEDRef = useRef<Mesh>(null!);

  const [loaded, setLoaded] = useState(false);
  // const azimuthAngle = -Math.PI / 3;
  // const polarAngle = (3 * Math.PI) / 8;
  const azimuthAngle = -Math.PI / 8;
  const polarAngle = (3 * Math.PI) / 8;
  setTimeout(function () {
    setLoaded(true);
  }, 5000);

  return (
    <Canvas camera={{ zoom: 4, position: [0, -ledHeight / 2, 5] }}>
      {/* <color attach="background" args={["#111"]} /> */}
      <OrbitControls
        enableZoom={false}
        minAzimuthAngle={loaded ? -Math.PI / 4 : azimuthAngle}
        maxAzimuthAngle={loaded ? Math.PI / 4 : azimuthAngle}
        minPolarAngle={loaded ? Math.PI / 4 : polarAngle}
        maxPolarAngle={loaded ? Math.PI / 2 : polarAngle}
        // autoRotate={true}
        // autoRotateSpeed={1}
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

      {props.useBloom && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            mipmapBlur
            luminanceThreshold={1}
            levels={8}
            intensity={0.4 * 4}
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
