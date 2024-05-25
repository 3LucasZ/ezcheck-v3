import * as THREE from "three";
import { useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Effects, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { UnrealBloomPass } from "three-stdlib";
import Layout from "components/Layout/MainLayout";

extend({ UnrealBloomPass });

export default function App() {
  return (
    <Layout>
      <Canvas orthographic camera={{ zoom: 100 }}>
        <color attach="background" args={["#111"]} />
        <OrbitControls
          enableZoom={false}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <ambientLight />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            mipmapBlur
            luminanceThreshold={1}
            levels={8}
            intensity={0.4 * 4}
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>

        <Shape color="hotpink" position={[-2, 0, 0]}>
          <boxGeometry args={[1.5, 1.5]} />
        </Shape>
        <Shape
          color="orange"
          position={[0, -0.25, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[1, 1]} />
        </Shape>
        <Shape color="skyblue" position={[2, 0, 0]}>
          <sphereGeometry args={[0.8, 64]} />
        </Shape>
      </Canvas>
    </Layout>
  );
}

function Shape({ children, color, ...props }) {
  const [hovered, hover] = useState(true);
  return (
    <mesh
      {...props}
      onPointerOver={() => hover(false)}
      onPointerOut={() => hover(true)}
    >
      {children}
      {/* Now, in order to get selective bloom we simply crank colors out of
        their natural spectrum. Where colors are normally defined between 0 - 1 we push them
        way out of range, into a higher defintion (HDR). What previously was [1, 1, 1] now could
        for instance be [10, 10, 10]. This requires that toneMapping is off, or it clamps to 1 */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={!hovered ? 4 : 0}
        toneMapped={false}
      />
    </mesh>
  );
}
