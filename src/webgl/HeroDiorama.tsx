import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
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

// Objetos "vivos" do diorama: hover acende, click navega. O nome bate com o nó
// do glb. E o gancho pra ideia do site rodando dentro do monitor.
const ALVOS: Record<string, { rota: string; label: string }> = {
  ChairTop: { rota: "/estudio", label: "o estúdio" },
  PicV: { rota: "/trabalhos", label: "trabalhos" },
  PicH: { rota: "/laboratorio", label: "laboratório" },
};

interface AnimProps {
  reduced: boolean;
  flicker: number;
  giroPausa: number;
  onHover: (label: string | null) => void;
}

const Diorama = ({ reduced, flicker, giroPausa, onHover }: AnimProps) => {
  const { scene } = useGLTF(DIORAMA, DRACO);
  const navigate = useNavigate();
  const screen = useRef<THREE.MeshStandardMaterial | null>(null);
  const [ativo, setAtivo] = useState<string | null>(null);
  // parte de cima da cadeira gamer: gira sozinha, a base fica parada
  const cadeira = useRef<THREE.Object3D | null>(null);
  const giro = useRef({ ate: 5, de: 0, para: 0, t0: 0, dur: 0 });

  useEffect(() => {
    scene.traverse((o) => {
      // o assento (separado da base no Blender; origem no eixo do pistao)
      if (o.name === "ChairTop") cadeira.current = o;
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
        // sem empurrao aqui: no export novo as fotos ja saem 2cm A FRENTE da
        // parede. (o que as ocluia antes era o `optimize` fundindo as paredes
        // dentro do no "Floor" — resolvido exportando sem join/flatten.)
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
    // cadeira: de tempos em tempos o assento roda. So o topo — a base fica
    // cravada, como cadeira gamer de verdade.
    const c = cadeira.current;
    if (c) {
      const g = giro.current;
      if (g.dur === 0 && t > g.ate) {
        // uma rodada: entre 3/4 de volta e 2 voltas, pra um lado ou pro outro
        const voltas = (0.75 + Math.random() * 1.25) * (Math.random() < 0.5 ? -1 : 1);
        g.de = c.rotation.y;
        g.para = g.de + voltas * Math.PI * 2;
        g.t0 = t;
        g.dur = 1.6 + Math.random() * 1.4;
      }
      if (g.dur > 0) {
        const k = Math.min(1, (t - g.t0) / g.dur);
        // easeOutCubic: sai rapido e vai morrendo — inercia de cadeira
        const e = 1 - Math.pow(1 - k, 3);
        c.rotation.y = g.de + (g.para - g.de) * e;
        if (k >= 1) {
          g.dur = 0;
          g.ate = t + giroPausa + Math.random() * giroPausa;
        }
      }
    }
  });

  // realce do hover: sob a paleta 1-bit nao adianta outline sutil — o que le e
  // subir a luminancia, ai o objeto pula pra banda do branco.
  useEffect(() => {
    if (!ativo) return;
    const orig = new Map<THREE.MeshStandardMaterial, number>();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      let p: THREE.Object3D | null = o;
      let nome: string | null = null;
      while (p) { if (ALVOS[p.name]) { nome = p.name; break; } p = p.parent; }
      // so o alvo em hover. sem `ativo` acima, null !== null era falso e isso
      // acendia a cena inteira.
      if (!nome || nome !== ativo) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (!mat || !("emissive" in mat)) return;
      orig.set(mat, mat.emissiveIntensity ?? 1);
      mat.emissive = new THREE.Color("#ffffff");
      mat.emissiveIntensity = 0.55;
    });
    return () => {
      orig.forEach((v, mat) => {
        mat.emissive = new THREE.Color("#000000");
        mat.emissiveIntensity = v;
      });
    };
  }, [scene, ativo]);

  // O raycast do R3F sobe pelos pais, entao acho o alvo subindo a hierarquia.
  const alvoDe = (o: THREE.Object3D | null): string | null => {
    let p: THREE.Object3D | null = o;
    while (p) {
      if (ALVOS[p.name]) return p.name;
      p = p.parent;
    }
    return null;
  };

  return (
    <primitive
      object={scene}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        const nome = alvoDe(e.object);
        if (!nome) return;
        e.stopPropagation();
        setAtivo(nome);
        onHover(ALVOS[nome].label);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setAtivo(null);
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const nome = alvoDe(e.object);
        if (!nome) return;
        e.stopPropagation();
        document.body.style.cursor = "";
        navigate(ALVOS[nome].rota);
      }}
    />
  );
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

// Camera: parallax do mouse + reacao ao scroll.
//  - mouse: te deixa espiar dentro do diorama
//  - scroll: o hero e sticky e a proxima secao sobe por cima; entao enquanto ela
//    sobe a camera recua e desce um pouco. O diorama "afunda" em vez de so ficar
//    parado sendo tapado — o corte fica sendo uma transicao, nao uma cortina.
// Damping por constante de tempo (identico em 60Hz ou 144Hz). Reduced-motion trava.
const Rig = ({
  reduced,
  parallax,
  suavidade,
  scrollRecuo,
}: {
  reduced: boolean;
  parallax: number;
  suavidade: number;
  scrollRecuo: number;
}) => {
  const { camera, pointer } = useThree();
  const base = useMemo(() => new THREE.Vector3(...CAM_POS), []);
  const goal = useMemo(() => new THREE.Vector3(), []);
  const alvo = useMemo(() => CAM_TARGET.clone(), []);
  const progresso = useRef(0);

  // 0 -> hero cheio na tela; 1 -> hero totalmente coberto
  useEffect(() => {
    if (reduced) return;
    const ler = () => {
      const h = window.innerHeight || 1;
      progresso.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    ler();
    window.addEventListener("scroll", ler, { passive: true });
    window.addEventListener("resize", ler);
    return () => {
      window.removeEventListener("scroll", ler);
      window.removeEventListener("resize", ler);
    };
  }, [reduced]);

  useFrame((_, dt) => {
    if (reduced) {
      camera.position.copy(base);
      camera.lookAt(CAM_TARGET);
      return;
    }
    const s = progresso.current;
    // easeInOut pra o recuo nao arrancar no primeiro pixel de scroll
    const e = s * s * (3 - 2 * s);
    goal.set(
      base.x + pointer.x * parallax + e * scrollRecuo * 0.35,
      base.y + pointer.y * parallax * 0.55 + e * scrollRecuo * 0.5,
      base.z - Math.abs(pointer.x) * parallax * 0.15 + e * scrollRecuo,
    );
    camera.position.lerp(goal, 1 - Math.exp(-dt / Math.max(suavidade, 0.001)));
    // o alvo desce junto: da a sensacao de estar se afastando pra cima
    alvo.set(CAM_TARGET.x, CAM_TARGET.y - e * scrollRecuo * 0.25, CAM_TARGET.z);
    camera.lookAt(alvo);
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
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    setReduced(prefersReducedMotion());
    setMounted(true);
  }, []);

  // Etapa 7 em calibragem
  const { parallax, suavidade, banSpeed, banPausa, giroPausa, scrollRecuo, flicker } = useControls("interacao", {
    parallax: { value: 0.35, min: 0, max: 1.2, step: 0.01 },
    suavidade: { value: 0.18, min: 0.02, max: 0.8, step: 0.01 },
    banSpeed: { value: 0.22, min: 0.05, max: 0.8, step: 0.01 },
    banPausa: { value: 4, min: 1, max: 12, step: 0.5 },
    giroPausa: { value: 7, min: 2, max: 25, step: 0.5 },
    scrollRecuo: { value: 1.1, min: 0, max: 3, step: 0.05 },
    flicker: { value: 1, min: 0, max: 3, step: 0.05 },
  });

  return (
    <div className="relative h-[calc(100svh-var(--bar-h))] w-full bg-[#b7bbc0]">
      {/* rotulo do objeto sob o cursor — mesma linguagem do [ ver ] do site */}
      {label ? (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 border border-ink/25 bg-paper/90 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink">
          [ {label} ]
        </div>
      ) : null}
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
          <Rig reduced={reduced} parallax={parallax} suavidade={suavidade} scrollRecuo={scrollRecuo} />
          <Suspense fallback={null}>
            <Diorama reduced={reduced} flicker={flicker} giroPausa={giroPausa} onHover={setLabel} />
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
