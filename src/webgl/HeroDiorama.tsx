import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import * as THREE from "three";
import { prefersReducedMotion } from "@/motion/prefs";
import { MoebiusEffect } from "./MoebiusEffect";
import { RetroEffect } from "./RetroEffect";
import { CrtEffect } from "./CrtEffect";

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
      // quadros: unlit (imagem cheia) pra a arte aparecer forte; a hachura por
      // luminancia so pega as partes escuras da capa (poucas hachuras).
      if (mat && (mat.name === "QuadroVert" || mat.name === "QuadroHoriz") && mat.map) {
        mat.map.colorSpace = THREE.SRGBColorSpace;
        mat.map.needsUpdate = true;
        m.material = new THREE.MeshBasicMaterial({
          map: mat.map,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
        // as fotos vinham ~1cm ATRAS da superficie da parede (o mesh "Floor" e o
        // box do comodo) -> a parede as ocluia. empurra pra frente (a cena usa
        // +z como lado da camera) pra a arte aparecer.
        m.position.z += 0.06;
        m.updateMatrixWorld(true);
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};

// Passe Moebius (Etapa 4) — valores calibrados e TRAVADOS (ver MoebiusEffect).
// Tem passe proprio (CONVOLUTION) pra rodar full-res antes do retro pixelizar.
const Moebius = () => {
  const { scene, camera } = useThree();
  const effect = useMemo(() => new MoebiusEffect(scene, camera), [scene, camera]);
  useEffect(() => () => effect?.dispose?.(), [effect]);
  return <primitive object={effect} dispose={null} />;
};

// Passe retro/bitmap (Etapa 5) — pixelizacao + Bayer 4x4 + paleta 1-bit
// (ink/azul/branco). Valores calibrados e TRAVADOS (ver RetroEffect).
const Retro = () => {
  const effect = useMemo(() => new RetroEffect(), []);
  return <primitive object={effect} dispose={null} />;
};

// Passe CRT (Etapa 6) — o ultimo: curvatura, scanlines, vinheta. Em calibragem.
const Crt = () => {
  const { ligado, curvatura, scanline, scanScale, vinheta, brilho } = useControls("crt", {
    ligado: { value: true },
    curvatura: { value: 0.06, min: 0, max: 0.3, step: 0.005 },
    scanline: { value: 0.12, min: 0, max: 0.6, step: 0.01 },
    scanScale: { value: 1.6, min: 0.5, max: 4, step: 0.1 },
    vinheta: { value: 0.35, min: 0, max: 1.5, step: 0.05 },
    brilho: { value: 1.05, min: 0.5, max: 1.6, step: 0.01 },
  });
  const effect = useMemo(() => new CrtEffect(), []);
  useEffect(() => {
    effect.curvature = ligado ? curvatura : 0;
    effect.scanline = ligado ? scanline : 0;
    effect.scanScale = scanScale;
    effect.vignette = ligado ? vinheta : 0;
    effect.brightness = ligado ? brilho : 1;
  }, [effect, ligado, curvatura, scanline, scanScale, vinheta, brilho]);
  return <primitive object={effect} dispose={null} />;
};

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
          {/* ordem: Moebius (passe proprio, full-res) -> retro -> CRT */}
          <EffectComposer>
            <Moebius />
            <Retro />
            <Crt />
          </EffectComposer>
        </Canvas>
      ) : null}
    </div>
  );
};

export default HeroDiorama;
