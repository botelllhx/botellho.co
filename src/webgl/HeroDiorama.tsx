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
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && mat.name === "MonitorScreen") {
        mat.emissive = new THREE.Color("#1c3fd6");
        mat.emissiveIntensity = 1.3;
        mat.toneMapped = false;
      }
      // quadros: unlit (imagem cheia) — sao "conteudo" e ficam fora da hachura
      if (mat && (mat.name === "QuadroVert" || mat.name === "QuadroHoriz")) {
        m.material = new THREE.MeshBasicMaterial({ map: mat.map, toneMapped: false });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};

// Passe Moebius (Etapa 3: buffers). Renderiza normais + profundidade e permite
// visualizar cada buffer via leva pra aprovar antes do Sobel (Etapa 4).
const Moebius = forwardRef<MoebiusEffect>((_, ref) => {
  const { scene, camera } = useThree();
  const { modo, outlineThickness, depthScale, normalScale, wobbleAmp, wobbleFreq, hatch, hatchSpacing, hatchLevel, specThreshold, shininess } = useControls("moebius", {
    modo: { value: 0, options: { moebius: 0, normais: 1, profundidade: 2 } },
    outlineThickness: { value: 1.4, min: 0.3, max: 4, step: 0.1 },
    depthScale: { value: 25, min: 0, max: 80, step: 1 },
    normalScale: { value: 1.0, min: 0, max: 6, step: 0.1 },
    wobbleAmp: { value: 3.0, min: 0, max: 12, step: 0.1 },
    wobbleFreq: { value: 0.08, min: 0.01, max: 0.4, step: 0.01 },
    hatch: { value: true },
    hatchSpacing: { value: 8, min: 3, max: 20, step: 1 },
    hatchLevel: { value: 0.33, min: 0.05, max: 0.7, step: 0.01 },
    specThreshold: { value: 0.25, min: 0, max: 1, step: 0.01 },
    shininess: { value: 40, min: 1, max: 200, step: 1 },
  });
  const effect = useMemo(() => new MoebiusEffect(scene, camera), [scene, camera]);
  useEffect(() => {
    effect.debug = modo;
    effect.outlineThickness = outlineThickness;
    effect.depthScale = depthScale;
    effect.normalScale = normalScale;
    effect.wobbleAmp = wobbleAmp;
    effect.wobbleFreq = wobbleFreq;
    effect.hatch = hatch;
    effect.hatchSpacing = hatchSpacing;
    effect.hatchLevel = hatchLevel;
    effect.specThreshold = specThreshold;
    effect.shininess = shininess;
  }, [effect, modo, outlineThickness, depthScale, normalScale, wobbleAmp, wobbleFreq, hatch, hatchSpacing, hatchLevel, specThreshold, shininess]);
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
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: CAM_POS, fov: CAM_FOV, near: 0.1, far: 15 }}
          onCreated={({ camera, scene }) => {
            camera.lookAt(CAM_TARGET);
            scene.background = new THREE.Color("#b7bbc0");
          }}
        >
          {/* sem shadow map: a sombra do moebius e por cross-hatch */}
          <ambientLight intensity={1.05} />
          <directionalLight position={[4.5, 6, 3.5]} intensity={2.7} />
          <directionalLight position={[-4, 3, -2]} intensity={0.7} />
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
