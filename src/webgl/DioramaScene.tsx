import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import BanModel from "./BanModel";

// Estudio-diorama do Ban com os modelos reais (otimizados) que o Mateus
// forneceu: setup gamer (monitor+teclado+pc), cadeira e planta, mais a sala
// e o Ban procedural (placeholder ate haver um modelo do Ban). Camera guiada
// pelo scroll + parallax de cursor. Tudo rasterizado pelo pipeline bitmap.

const DRACO = "/draco/";
const WALL = "#6f6f6f";
const DESK = "#7a7a7a";
const PHOSPHOR = "#0b2ca2";

useGLTF.preload("/3d/gamer_setup_pack.glb", DRACO);
useGLTF.preload("/3d/cadeira_gamer.glb", DRACO);
useGLTF.preload("/3d/potted_plant.glb", DRACO);

const GamerSetup = () => {
  const { scene } = useGLTF("/3d/gamer_setup_pack.glb", DRACO);
  const cloned = useMemo(() => {
    const s = scene.clone(true);
    // Faz as telas/leds do monitor acenderem em phosphor
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const name = m.name.toLowerCase();
      if (name.includes("monitor") || name.includes("led") || name.includes("glass")) {
        m.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(PHOSPHOR) });
      }
    });
    return s;
  }, [scene]);
  // setup ~2u de largura; centro y=0.63 (base no chao local)
  return <primitive object={cloned} position={[-1.1, 1.0, -1.4]} rotation={[0, 0.35, 0]} scale={1.15} />;
};

const Chair = () => {
  const { scene } = useGLTF("/3d/cadeira_gamer.glb", DRACO);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  // origem alta (centro y=4.58, altura 2.26): base ~3.45 -> desce pro chao
  return <primitive object={cloned} position={[0.9, -3.45, 0.6]} rotation={[0, -0.5, 0]} scale={0.95} />;
};

const Plant = () => {
  const { scene } = useGLTF("/3d/potted_plant.glb", DRACO);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} position={[-3.4, 0.35, -1.2]} scale={1.3} />;
};

const DioramaScene = () => {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame(() => {
    const p = scroll.current;
    const target = new THREE.Vector3(-4 + p * 2.6 + pointer.current.x * 0.9, 2 - p * 0.9 + pointer.current.y * 0.6, 8 - p * 4);
    camera.position.lerp(target, 0.06);
    camera.lookAt(0.2 + pointer.current.x * 0.4, 0.2, -0.6);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 6, 5]} intensity={3} />
      <directionalLight position={[5, 2, -1]} intensity={1.6} />
      <pointLight position={[-1, 1.4, 0]} intensity={16} distance={8} color="#4a6bd8" />

      {/* Sala em corte: chao + parede de fundo + parede lateral */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.95} />
      </mesh>
      <mesh position={[0, 5, -3]}>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color={WALL} roughness={0.98} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4.6, 5, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color={WALL} roughness={0.98} />
      </mesh>

      {/* Mesa */}
      <group position={[-1, 0, -1.4]}>
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[5, 0.16, 2]} />
          <meshStandardMaterial color={DESK} roughness={0.85} />
        </mesh>
        {[[-2.2, -0.8], [2.2, -0.8], [-2.2, 0.8], [2.2, 0.8]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.45, z]}>
            <boxGeometry args={[0.16, 1, 0.16]} />
            <meshStandardMaterial color={DESK} roughness={0.85} />
          </mesh>
        ))}
      </group>

      <GamerSetup />
      <Chair />
      <Plant />

      {/* Tapete + o Ban vivendo na cena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.4, 0.02, 1.6]}>
        <planeGeometry args={[4, 2.6]} />
        <meshStandardMaterial color="#565656" roughness={0.98} />
      </mesh>
      <BanModel position={[1.4, 0.5, 1.7]} scale={0.5} />
    </>
  );
};

export default DioramaScene;
