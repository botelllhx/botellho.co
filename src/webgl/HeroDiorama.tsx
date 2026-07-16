import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { prefersReducedMotion } from "@/motion/prefs";
import { MoebiusEffect } from "./MoebiusEffect";
import { RetroEffect } from "./RetroEffect";
import { CrtEffect } from "./CrtEffect";
import { criarTelaViva } from "./telaViva";

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

// 3/4 de onde a camera acompanha o Ban: fixo no mundo, entao ele vira dentro do
// quadro em vez de a camera girar junto com ele.
const DIR_BAN = new THREE.Vector3(0.75, 0.45, 1).normalize();

// De onde a camera olha no foco de ABERTURA (/estudio). Reto no eixo Z o encosto
// da cadeira (topo em ~1.15) fica bem na frente da tela (centro em ~1.0): olho um
// pouco de cima e de lado, e a tela aparece limpa por cima do encosto.
const DIR_ABERTURA = new THREE.Vector3(0.5, 0.62, 1).normalize();

// posicoes convertidas do Blender (Z-up) pra R3F (Y-up): (x,y,z)->(x,z,-y)
// enquadramento fechado 3/4 aprovado (blender cam 2.95,-2.85,1.5 -> alvo 0.12,0,0.42)
const CAM_POS: [number, number, number] = [2.95, 1.5, 2.85];
const CAM_TARGET = new THREE.Vector3(0.12, 0.42, 0);
const CAM_FOV = 43;

const SCREEN_BASE = 1.3;

// Textura da tela: ela ACENDE e mostra algo, em vez de ser retangulo azul morto.
const TELA = "/ban/ban-mark.png";

// Objetos "vivos" do diorama. Click NAO navega: a camera vai ate o item, de
// frente, e a legenda aparece. Clicar de novo (ou Esc) volta.
// A chave e a tag que o traverse poe em userData.alvo.
const ALVOS: Record<string, { label: string }> = {
  Monitor: { label: "o estúdio" },
  PicV: { label: "trabalhos" },
  PicH: { label: "laboratório" },
  Ban: { label: "ban, o salsicha" },
};

export interface Foco {
  obj: THREE.Object3D;
  label: string;
  /** foco de ABERTURA (pagina do estudio): quer mais respiro que um zoom de click */
  abertura?: boolean;
  // o Ban nao fica parado: a camera recalcula o enquadramento a cada frame
  seguir?: boolean;
}

interface AnimProps {
  reduced: boolean;
  flicker: number;
  giroPausa: number;
  onHover: (label: string | null) => void;
  onFocar: (f: Foco | null) => void;
  foco: Foco | null;
  // abre a cena ja focada num alvo (ex.: a pagina do estudio abre na tela)
  focoInicial?: string;
}

const Diorama = ({ reduced, flicker, giroPausa, onHover, onFocar, foco, focoInicial }: AnimProps) => {
  const { scene } = useGLTF(DIORAMA, DRACO);
  const screen = useRef<THREE.MeshBasicMaterial | null>(null);
  const [ativo, setAtivo] = useState<string | null>(null);
  // parte de cima da cadeira gamer: gira sozinha, a base fica parada
  const cadeira = useRef<THREE.Object3D | null>(null);
  const giro = useRef({ ate: 5, de: 0, para: 0, t0: 0, dur: 0 });
  // a tela roda um boot DOS em loop e ACENDE a cena (unica fonte "viva" do diorama)
  const tela = useMemo(() => criarTelaViva(), []);
  const ativoObj = useRef<THREE.Object3D | null>(null);
  const escala0 = useRef(new THREE.Vector3(1, 1, 1));

  useEffect(() => {
    scene.traverse((o) => {
      // o assento (separado da base no Blender; origem no eixo do pistao)
      if (o.name === "ChairTop") cadeira.current = o;
      // os quadros ja tem no proprio: tago pelo nome
      if (o.name === "PicV" || o.name === "PicH") o.userData.alvo = o.name;
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      // O useGLTF CACHEIA a cena: ao navegar entre paginas o mesmo objeto volta,
      // ja com os materiais trocados por mim (e sem nome). Se eu procurasse por
      // mat.name de novo, nao acharia nada — e a tela ficaria presa num
      // CanvasTexture morto (era isso que congelava ela no "build"). Entao gravo
      // a identidade em userData na primeira passada e uso ela dai em diante.
      if (mat?.name && !m.userData.matOrig) m.userData.matOrig = mat.name;
      const orig = (m.userData.matOrig as string | undefined) ?? mat?.name;

      if (orig === "MonitorScreen") {
        mat.emissive = new THREE.Color("#1c3fd6");
        mat.emissiveIntensity = SCREEN_BASE * 0.5;
        mat.toneMapped = false;
        m.userData.alvo = "Monitor";
      }
      // a tela ACESA: plano proprio, criado no Blender com UV 0-1 na frente do
      // monitor. unlit pra a marca brilhar sozinha e sobreviver ao 1-bit.
      if (orig === "MonitorTela") {
        // nada de papel de parede: entra o canvas animado. Sempre aponta pra
        // textura DESTE mount — a anterior pode estar morta (ver nota acima).
        const bm = mat as unknown as THREE.MeshBasicMaterial;
        if (bm?.isMeshBasicMaterial) {
          bm.map = tela.textura;
          bm.needsUpdate = true;
          screen.current = bm;
        } else {
          m.material = new THREE.MeshBasicMaterial({
            map: tela.textura,
            toneMapped: false,
            side: THREE.DoubleSide,
          });
          screen.current = m.material as THREE.MeshBasicMaterial;
        }
        m.userData.alvo = "Monitor";
      }
      // quadros: unlit (imagem cheia) pra a arte aparecer forte; a hachura por
      // luminancia so pega as partes escuras da capa (poucas hachuras).
      if ((orig === "QuadroVert" || orig === "QuadroHoriz") && mat?.map) {
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

    if (!focoInicial) return;
    // ja abre focado: acha o alvo tagueado e manda a camera pra ele
    // prefere a TELA (plana, bbox limpo) ao vidro curvo do monitor: o bbox do
    // vidro e irregular e joga o enquadramento pra dentro/torto.
    let alvo: THREE.Object3D | null = null;
    scene.traverse((o) => {
      if (o.userData?.alvo !== focoInicial) return;
      const mm = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (!alvo || o.name === "MonitorTela" || mm?.name === "MonitorTela") alvo = o;
    });
    if (alvo && ALVOS[focoInicial]) {
      onFocar({ obj: alvo, label: ALVOS[focoInicial].label, abertura: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, focoInicial]);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    // a tela desenha o boot em loop
    tela.desenhar(t);
    // cintilancia de tubo velho (duas senoides dessincronizadas). A tela e unlit,
    // entao o nervosismo vai na COLOR (que multiplica a textura).
    const f = Math.sin(t * 8.0) * 0.05 + Math.sin(t * 27.0) * 0.03;
    if (screen.current) {
      const b = SCREEN_BASE + f * flicker;
      screen.current.color.setRGB(b, b, b);
    }
    // hover: PISCA em blocos, tipo seleção de terminal. Sob a paleta 1-bit um
    // brilho suave e literalmente invisivel (ou o pixel cruza a banda do branco
    // ou nao muda nada), entao vai no talo: alterna entre normal e estourado a
    // 3Hz. Mais 4% de escala, que e geometrico e sobrevive ao Moebius.
    const ao = ativoObj.current;
    if (ao) {
      const on = Math.sin(t * 19) > 0;
      const p = 1 + (on ? 0.04 : 0);
      ao.scale.set(escala0.current.x * p, escala0.current.y * p, escala0.current.z * p);
      ao.traverse((c) => {
        const cm = c as THREE.Mesh;
        if (!cm.isMesh) return;
        const mm = cm.material as THREE.MeshStandardMaterial;
        if (!mm || !mm.color) return;
        const v = on ? 6 : 1;
        if (mm.userData.__base === undefined) mm.userData.__base = mm.color.getHex();
        mm.color.setRGB(v, v, v);
      });
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
      const nome = tagDe(o);
      // so o alvo em hover. sem o `ativo` acima, null !== null era falso e isso
      // acendia a cena inteira.
      if (!nome || nome !== ativo) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (!mat) return;
      // os quadros viraram MeshBasicMaterial (unlit) e NAO tem emissive — era
      // por isso que o realce nao acontecia neles. Nesse caso clareia a `color`,
      // que multiplica a textura; no resto usa emissive mesmo.
      if ("emissive" in mat && mat.emissive) {
        orig.set(mat, mat.emissiveIntensity ?? 1);
        mat.userData.__emissive = mat.emissive.getHex();
        mat.emissive = new THREE.Color("#ffffff");
        mat.emissiveIntensity = 1.6;
      } else {
        orig.set(mat, -1); // marca: e basic, restaura pela color
        mat.userData.__color = mat.color.getHex();
        mat.color = new THREE.Color(2.2, 2.2, 2.2);
      }
    });
    return () => {
      orig.forEach((v, mat) => {
        if (v === -1) {
          mat.color = new THREE.Color(mat.userData.__color ?? 0xffffff);
        } else {
          mat.emissive = new THREE.Color(mat.userData.__emissive ?? 0x000000);
          mat.emissiveIntensity = v;
        }
      });
    };
  }, [scene, ativo]);

  // devolve escala e cor do ultimo item em hover
  const limparHover = () => {
    const ao = ativoObj.current;
    if (ao) {
      ao.scale.copy(escala0.current);
      ao.traverse((c) => {
        const cm = c as THREE.Mesh;
        const mm = cm.material as THREE.MeshStandardMaterial;
        if (mm?.userData?.__base !== undefined) mm.color.setHex(mm.userData.__base);
      });
    }
    ativoObj.current = null;
    setAtivo(null);
    onHover(null);
  };

  // O raycast do R3F entrega a malha; o alvo pode estar nela ou num pai.
  const tagDe = (o: THREE.Object3D | null): string | null => {
    let p: THREE.Object3D | null = o;
    while (p) {
      const tag = p.userData?.alvo as string | undefined;
      if (tag && ALVOS[tag]) return tag;
      p = p.parent;
    }
    return null;
  };
  const objDe = (o: THREE.Object3D | null): THREE.Object3D | null => {
    let p: THREE.Object3D | null = o;
    while (p) {
      const tag = p.userData?.alvo as string | undefined;
      if (tag && ALVOS[tag]) return p;
      p = p.parent;
    }
    return null;
  };

  return (
    <>
      <primitive
        object={scene}
        // onPointerMove, NAO onPointerOver: o handler esta na RAIZ do diorama, e o
      // `over` do R3F so dispara ao entrar nesse objeto — trocar de filho (chao ->
      // quadro) nao redispara. Por isso o hover parecia morto e "acordava" quando
      // um alt-tab / print forcava um pointerout+over novo. O `move` reporta o
      // alvo debaixo do cursor a cada movimento.
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        if (foco) return;
        const nome = tagDe(e.object);
        const alvo = objDe(e.object);
        if (!nome || !alvo) {
          if (ativoObj.current) limparHover();
          return;
        }
        e.stopPropagation();
        if (ativoObj.current !== alvo) {
          limparHover();
          // guarda a escala INTEIRA: os quadros sao nao-uniformes (PicV .52/.52/1,
          // PicH .66/.37/1) e usar so o X deformava a altura deles.
          escala0.current.copy(alvo.scale);
          ativoObj.current = alvo;
        }
        setAtivo(nome);
        onHover(ALVOS[nome].label);
      }}
      onPointerOut={() => limparHover()}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const alvo = objDe(e.object);
        const nome = tagDe(e.object);
        if (!alvo || !nome) return;
        e.stopPropagation();
        limparHover();
        // click aproxima em vez de navegar: a camera vai ate o item, de frente
        onFocar({ obj: alvo, label: ALVOS[nome].label });
      }}
      />
    </>
  );
};

// O Ban de verdade: riggado no Blender (21 ossos), clipes walk/idle. Anda um
// circuito pelo estudio e para de vez em quando pra abanar o rabo.
const Ban = ({
  reduced,
  speed,
  pausa,
  onHover,
  onFocar,
  foco,
}: {
  reduced: boolean;
  speed: number;
  pausa: number;
  onHover: (l: string | null) => void;
  onFocar: (f: Foco | null) => void;
  foco: Foco | null;
  // abre a cena ja focada num alvo (ex.: a pagina do estudio abre na tela)
  focoInicial?: string;
}) => {
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
    <group
      ref={pivo}
      // move (nao over) pelo mesmo motivo do diorama; e o stopPropagation impede
      // que o diorama atras dele limpe o hover do Ban.
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        if (foco) return;
        e.stopPropagation();
        onHover(ALVOS.Ban.label);
      }}
      onPointerOut={() => {
        onHover(null);
          }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onHover(null);
            // seguir: ele nao para de andar, a camera acompanha
        if (pivo.current) onFocar({ obj: pivo.current, label: ALVOS.Ban.label, seguir: true });
      }}
    >
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
  foco,
  zoomMargem,
}: {
  reduced: boolean;
  parallax: number;
  suavidade: number;
  scrollRecuo: number;
  foco: Foco | null;
  zoomMargem: number;
}) => {
  const { camera, pointer } = useThree();
  const base = useMemo(() => new THREE.Vector3(...CAM_POS), []);
  const goal = useMemo(() => new THREE.Vector3(), []);
  const alvo = useMemo(() => CAM_TARGET.clone(), []);
  const progresso = useRef(0);

  // Onde a camera precisa ficar pra enquadrar o item DE FRENTE. Tudo que e
  // clicavel (quadros na parede do fundo, monitor) encara +Z, entao a camera vai
  // pro +Z do centro do objeto, a uma distancia que faz ele preencher o quadro.
  const caixa = useMemo(() => new THREE.Box3(), []);
  const centro = useMemo(() => new THREE.Vector3(), []);
  const tam = useMemo(() => new THREE.Vector3(), []);
  const destPos = useMemo(() => new THREE.Vector3(), []);

  // Onde a camera fica pra enquadrar o item. Quadros e monitor encaram +Z, entao
  // a camera vai pro +Z deles. O Ban anda e vira, entao pra ele uso um 3/4 fixo
  // (nao gruda atras dele girando junto, que embrulharia o estomago).
  const enquadrar = (f: Foco) => {
    caixa.setFromObject(f.obj);
    if (caixa.isEmpty()) return null;
    caixa.getCenter(centro);
    caixa.getSize(tam);
    const cam = camera as THREE.PerspectiveCamera;
    const fovV = THREE.MathUtils.degToRad(cam.fov);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * cam.aspect);
    // distancia que satisfaz ALTURA e LARGURA. So a altura (como era antes) faz
    // a camera entrar demais em container estreito, tipo o 4:3 do /estudio.
    const largura = Math.max(tam.x, tam.z);
    const dV = tam.y / 2 / Math.tan(fovV / 2);
    const dH = largura / 2 / Math.tan(fovH / 2);
    const dist = Math.max(dV, dH) * zoomMargem * (f.abertura ? 1.9 : 1);
    if (f.seguir) {
      destPos.copy(centro).add(DIR_BAN.clone().multiplyScalar(dist));
    } else if (f.abertura) {
      destPos.copy(centro).add(DIR_ABERTURA.clone().multiplyScalar(dist));
    } else {
      destPos.set(centro.x, centro.y, centro.z + dist);
    }
    return { pos: destPos, olhar: centro };
  };

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
    // focado: a camera cruza ate o item e ignora mouse/scroll. Damping mais
    // lento (0.5s) pra o movimento ler como cinema, nao como teleporte.
    if (foco) {
      const d = enquadrar(foco);
      if (d) {
        // seguindo o Ban: damping mais curto, senao a camera fica pra tras dele
        const k = 1 - Math.exp(-dt / (foco.seguir ? 0.28 : 0.5));
        camera.position.lerp(d.pos, k);
        alvo.lerp(d.olhar, k);
        camera.lookAt(alvo);
        return;
      }
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

interface HeroProps {
  /** abre a cena ja focada num alvo. Ex.: "Monitor" na pagina do estudio. */
  focoInicial?: string;
  /** trava a camera no foco inicial: sem Esc, sem click pra sair, sem legenda de
   *  saida. E o caso do /estudio, onde o diorama e cenario, nao brinquedo. */
  travado?: boolean;
  /** altura do container. Padrao: a tela toda abaixo da barra (home). */
  className?: string;
}

const HeroDiorama = ({ focoInicial, travado, className }: HeroProps = {}) => {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [foco, setFoco] = useState<Foco | null>(null);
  // a legenda cola no cursor em vez de morar num canto solto
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mover = (e: MouseEvent) => {
      const el = cursor.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 16}px, 0)`;
    };
    window.addEventListener("mousemove", mover, { passive: true });
    return () => window.removeEventListener("mousemove", mover);
  }, []);

  // Esc devolve a camera. Sem isso o usuario fica preso no zoom.
  useEffect(() => {
    if (!foco || travado) return;
    const sair = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFoco(null);
    };
    window.addEventListener("keydown", sair);
    return () => window.removeEventListener("keydown", sair);
  }, [foco, travado]);
  useEffect(() => {
    setReduced(prefersReducedMotion());
    setMounted(true);
  }, []);

  // Etapa 7: valores calibrados e TRAVADOS pelo Mateus.
  const parallax = 1.2;
  const suavidade = 0.18;
  const banSpeed = 0.22;
  const banPausa = 4.0;
  const giroPausa = 7.0;
  const scrollRecuo = 3.0;
  const zoomMargem = 1.35;
  const flicker = 1.0;

  return (
    <div
      className={`relative w-full bg-[#b7bbc0] ${
        className ?? "h-[calc(100svh-var(--bar-h))]"
      } ${label && !foco ? "hero-alvo" : ""}`}
    >
      {/* focado: clicar em qualquer lugar volta */}
      {foco && !travado ? <div className="absolute inset-0 z-10" onClick={() => setFoco(null)} /> : null}

      {/* a legenda COLA no cursor (fixed, seguindo o mouse) — some quando nao ha
          nada sob o ponteiro nem item focado */}
      <div
        ref={cursor}
        className={`pointer-events-none fixed left-0 top-0 z-20 flex items-center gap-2 border border-ink/25 bg-paper/95 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-ink transition-opacity duration-150 ${
          label || (foco && !travado) ? "opacity-100" : "opacity-0"
        }`}
      >
        <span>{foco && !travado ? foco.label : label}</span>
        {foco && !travado ? <span className="text-ink/45">esc para voltar</span> : null}
      </div>
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
          <Rig reduced={reduced} parallax={parallax} suavidade={suavidade} scrollRecuo={focoInicial ? 0 : scrollRecuo} foco={foco} zoomMargem={zoomMargem} />
          <Suspense fallback={null}>
            <Diorama reduced={reduced} flicker={flicker} giroPausa={giroPausa} onHover={setLabel} onFocar={setFoco} foco={foco} focoInicial={focoInicial} />
            <Ban reduced={reduced} speed={banSpeed} pausa={banPausa} onHover={setLabel} onFocar={setFoco} foco={foco} />
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
