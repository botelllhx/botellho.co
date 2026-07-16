import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
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
const BAN = "/3d/ban_rigged.glb";
const DRACO = "/draco/";
if (typeof window !== "undefined") {
  useGLTF.preload(DIORAMA, DRACO);
  useGLTF.preload(BAN, DRACO);
}

// O ban_rigged.glb sai na posicao original do diorama (blender 0.95,-0.5,0 ->
// gltf 0.95,0,0.5) e olhando pra +Z. NAO se centraliza mexendo em osso: isso
// quebra a animacao (as actions foram autoradas contra o rest original, e mover
// o rest faz os ossos CONECTADOS voarem pro offset antigo). Centraliza-se aqui,
// com um grupo interno — assim o grupo de fora vira o pivo do cao.
const BAN_OFFSET: [number, number, number] = [-0.95, 0, -0.5];

// caminho do Ban pelo estudio (pontos no plano XZ), fechado em loop
const BAN_PATH = [
  [0.95, 0.55], [0.35, 0.8], [-0.45, 0.6], [-0.7, 0.0], [-0.1, -0.25], [0.7, 0.05],
] as const;
// quanto o trote avanca por ciclo (1s): ~2 * comprimento da perna * sin(22deg).
// e com isso que eu caso a velocidade do path com o timeScale -> os pes nao patinam.
const STRIDE_PER_CYCLE = 0.127;

// posicoes convertidas do Blender (Z-up) pra R3F (Y-up): (x,y,z)->(x,z,-y)
// enquadramento fechado 3/4 aprovado (blender cam 2.95,-2.85,1.5 -> alvo 0.12,0,0.42)
const CAM_POS: [number, number, number] = [2.95, 1.5, 2.85];
const CAM_TARGET = new THREE.Vector3(0.12, 0.42, 0);
const CAM_FOV = 43;

const SCREEN_BASE = 1.3;

interface AnimProps {
  reduced: boolean;
  flicker: number;
}

const Diorama = ({ reduced, flicker }: AnimProps) => {
  const { scene } = useGLTF(DIORAMA, DRACO);
  const screen = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    scene.traverse((o) => {
      // o Ban estatico do diorama some: quem entra e o riggado (ban_rigged.glb)
      if (o.name === "Ban") o.visible = false;
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && mat.name === "MonitorScreen") {
        mat.emissive = new THREE.Color("#1c3fd6");
        mat.emissiveIntensity = SCREEN_BASE;
        mat.toneMapped = false;
        screen.current = mat;
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

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    // monitor: cintilancia de tubo velho (duas senoides dessincronizadas)
    if (screen.current && flicker > 0) {
      const f = Math.sin(t * 8.0) * 0.05 + Math.sin(t * 27.0) * 0.03;
      screen.current.emissiveIntensity = SCREEN_BASE + f * flicker;
    }
  });

  return <primitive object={scene} />;
};

// O Ban de verdade: riggado no Blender (21 ossos), clipes walk/idle. Anda um
// circuito pelo estudio e para de vez em quando pra abanar o rabo.
const Ban = ({ reduced, speed, pausa }: { reduced: boolean; speed: number; pausa: number }) => {
  const { scene, animations } = useGLTF(BAN, DRACO);
  const pivo = useRef<THREE.Group>(null);
  // o mixer prende no SCENE (a raiz dos ossos), nunca no grupo que eu movo
  const { actions } = useAnimations(animations, scene);
  const dist = useRef(0);
  const fase = useRef({ andando: true, ate: 6 });

  const curva = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        BAN_PATH.map(([x, z]) => new THREE.Vector3(x, 0, z)),
        true,
        "catmullrom",
        0.5,
      ),
    [],
  );

  useEffect(() => {
    // SkinnedMesh tem bounding volume da bind pose -> o three o descarta no
    // frustum culling quando ele anda/deforma. Desliga (e um mesh so).
    scene.traverse((o) => {
      o.frustumCulled = false;
    });
  }, [scene]);

  useEffect(() => {
    actions.walk?.reset().play();
    actions.idle?.reset().play();
    if (actions.walk) actions.walk.weight = 1;
    if (actions.idle) actions.idle.weight = 0;
  }, [actions]);

  useFrame((state, dt) => {
    const g = pivo.current;
    if (!g) return;

    if (reduced) {
      const p = curva.getPointAt(0);
      g.position.set(p.x, 0, p.z);
      if (actions.walk) actions.walk.weight = 0;
      if (actions.idle) actions.idle.weight = 0;
      return;
    }

    const t = state.clock.elapsedTime;
    const f = fase.current;
    if (t > f.ate) {
      f.andando = !f.andando;
      f.ate = t + (f.andando ? 7 + Math.random() * 5 : pausa);
    }

    // crossfade walk<->idle
    const k = 1 - Math.exp(-dt / 0.25);
    if (actions.walk) actions.walk.weight = THREE.MathUtils.lerp(actions.walk.weight, f.andando ? 1 : 0, k);
    if (actions.idle) actions.idle.weight = THREE.MathUtils.lerp(actions.idle.weight, f.andando ? 0 : 1, k);

    if (f.andando) {
      if (actions.walk) actions.walk.timeScale = speed / STRIDE_PER_CYCLE;
      const len = curva.getLength();
      dist.current = (dist.current + speed * dt) % len;
      const u = dist.current / len;
      const p = curva.getPointAt(u);
      const tan = curva.getTangentAt(u);
      g.position.set(p.x, 0, p.z);
      // o Ban olha pra +Z e lookAt de nao-camera aponta o +Z no alvo
      g.lookAt(p.x + tan.x, 0, p.z + tan.z);
    }
  });

  return (
    <group ref={pivo}>
      <group position={BAN_OFFSET}>
        <primitive object={scene} />
      </group>
    </group>
  );
};

// Parallax de camera: o mouse te deixa espiar dentro do diorama. Damping com
// constante de tempo (independente de framerate). Em reduced-motion, trava.
const Rig = ({ reduced, parallax, suavidade }: { reduced: boolean; parallax: number; suavidade: number }) => {
  const { camera, pointer } = useThree();
  const base = useMemo(() => new THREE.Vector3(...CAM_POS), []);
  const goal = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (reduced) {
      camera.position.copy(base);
      camera.lookAt(CAM_TARGET);
      return;
    }
    goal.set(
      base.x + pointer.x * parallax,
      base.y + pointer.y * parallax * 0.55,
      base.z - Math.abs(pointer.x) * parallax * 0.15,
    );
    camera.position.lerp(goal, 1 - Math.exp(-dt / Math.max(suavidade, 0.001)));
    camera.lookAt(CAM_TARGET);
  });

  return null;
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

// Passe CRT (Etapa 6) — o ultimo: curvatura, scanlines, vinheta.
// Valores calibrados e TRAVADOS (ver CrtEffect).
const Crt = () => {
  const effect = useMemo(() => new CrtEffect(), []);
  return <primitive object={effect} dispose={null} />;
};

const HeroDiorama = () => {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(prefersReducedMotion());
    setMounted(true);
  }, []);

  // Etapa 7 em calibragem
  const { parallax, suavidade, banSpeed, banPausa, flicker } = useControls("interacao", {
    parallax: { value: 0.35, min: 0, max: 1.2, step: 0.01 },
    suavidade: { value: 0.18, min: 0.02, max: 0.8, step: 0.01 },
    banSpeed: { value: 0.22, min: 0.05, max: 0.8, step: 0.01 },
    banPausa: { value: 4, min: 1, max: 12, step: 0.5 },
    flicker: { value: 1, min: 0, max: 3, step: 0.05 },
  });

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
          <Rig reduced={reduced} parallax={parallax} suavidade={suavidade} />
          <Suspense fallback={null}>
            <Diorama reduced={reduced} flicker={flicker} />
            <Ban reduced={reduced} speed={banSpeed} pausa={banPausa} />
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
