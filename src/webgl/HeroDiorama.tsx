import { Suspense, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import * as THREE from "three";
import { prefersReducedMotion } from "@/motion/prefs";
import { MoebiusEffect } from "./MoebiusEffect";

// Hero: o estudio-diorama do Ban. Etapa 2 (cena crua): carrega o diorama.glb,
// camera 3/4 + luz direcional, SEM pos-processamento ainda. Full-width, ocupa a
// tela abaixo da barra. Client-only (WebGL nao roda no SSR).

const DIORAMA = "/3d/diorama.glb";
const DRACO = "/draco/";
if (typeof window !== "undefined") useGLTF.preload(DIORAMA, DRACO);

// posicoes convertidas do Blender (Z-up) pra R3F (Y-up): (x,y,z)->(x,z,-y)
// enquadramento fechado 3/4 aprovado (blender cam 2.95,-2.85,1.5 -> alvo 0.12,0,0.42)
const CAM_POS: [number, number, number] = [2.95, 1.5, 2.85];
const CAM_TARGET = new THREE.Vector3(0.12, 0.42, 0);
const CAM_FOV = 43;

const Diorama = () => {
  const { scene } = useGLTF(DIORAMA, DRACO);

  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && mat.name === "MonitorScreen") {
        mat.emissive = new THREE.Color("#1c3fd6");
        mat.emissiveIntensity = 1.3;
        mat.toneMapped = false;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};

// Passe Moebius (Etapa 3: buffers). Renderiza normais + profundidade e permite
// visualizar cada buffer via leva pra aprovar antes do Sobel (Etapa 4).
const Moebius = forwardRef<MoebiusEffect>((_, ref) => {
  const { scene, camera } = useThree();
  const { modo, specThreshold, shininess } = useControls("moebius", {
    modo: { value: 1, options: { cena: 0, normais: 1, profundidade: 2 } },
    specThreshold: { value: 0.55, min: 0, max: 1, step: 0.01 },
    shininess: { value: 40, min: 1, max: 200, step: 1 },
  });
  const effect = useMemo(() => new MoebiusEffect(scene, camera), [scene, camera]);
  useEffect(() => {
    effect.debug = modo;
    effect.specThreshold = specThreshold;
    effect.shininess = shininess;
  }, [effect, modo, specThreshold, shininess]);
  useEffect(() => () => effect.dispose(), [effect]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
Moebius.displayName = "Moebius";

const HeroDiorama = () => {
  const [mounted, setMounted] = useState(false);
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current = prefersReducedMotion();
    setMounted(true);
  }, []);

  return (
    <div className="h-[calc(100svh-var(--bar-h))] w-full bg-[#b7bbc0]">
      {mounted ? (
        <Canvas
          shadows
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: CAM_POS, fov: CAM_FOV, near: 0.1, far: 100 }}
          onCreated={({ camera, scene }) => {
            camera.lookAt(CAM_TARGET);
            scene.background = new THREE.Color("#b7bbc0");
          }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight
            position={[4.5, 6, 3.5]}
            intensity={2.6}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-4, 3, -2]} intensity={0.6} />
          <Suspense fallback={null}>
            <Diorama />
          </Suspense>
          <EffectComposer>
            <Moebius />
          </EffectComposer>
        </Canvas>
      ) : null}
    </div>
  );
};

export default HeroDiorama;
