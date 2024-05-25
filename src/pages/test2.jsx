import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  SelectiveBloom,
} from "@react-three/postprocessing";
import Layout from "components/Layout/MainLayout";

function Box({ onHover, ...props }) {
  const ref = useRef();
  useFrame(
    (state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta)
  );
  return (
    <mesh
      ref={ref}
      {...props}
      onPointerOver={(e) => onHover(ref)}
      onPointerOut={(e) => onHover(null)}
    >
      <boxGeometry />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

export default function App() {
  const [hovered, onHover] = useState(null);
  const selected = hovered ? [hovered] : undefined;
  const lightRef = useRef();
  const lightRef2 = useRef();
  const lightRef3 = useRef();

  return (
    <Layout>
      <Canvas>
        <ambientLight intensity={0.5} ref={lightRef} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          ref={lightRef2}
        />
        <pointLight position={[-10, -10, -10]} ref={lightRef3} />
        <Box onHover={onHover} position={[-1, 0, 0]} />
        <Box onHover={onHover} position={[1, 0, 0]} />
        <EffectComposer autoClear={false}>
          {/* <Outline selection={selected} visibleEdgeColor="white" edgeStrength={100} blur={true} /> */}
          <SelectiveBloom
            selection={selected}
            intensity={3.0}
            luminanceThreshold={0.01}
            luminanceSmoothing={0.025}
            lights={[lightRef, lightRef2, lightRef3]}
          />
        </EffectComposer>
      </Canvas>
    </Layout>
  );
}
