import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// O Ban como modelo reutilizavel: o dachshund low-poly com idle (respiro,
// rabo, orelhas, cabeca) e o olhar seguindo o cursor. Sem luzes nem chao,
// para ser plantado em qualquer cena (hero interim e diorama).
const BODY = "#9a9a9a";
const DARK = "#141414";

interface BanModelProps {
  /** posicao do grupo na cena */
  position?: [number, number, number];
  scale?: number;
}

const BanModel = ({ position = [0, 0, 0], scale = 1 }: BanModelProps) => {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const earL = useRef<THREE.Mesh>(null);
  const earR = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const mats = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: new THREE.Color(BODY), roughness: 0.65, metalness: 0 }),
      dark: new THREE.MeshStandardMaterial({ color: new THREE.Color(DARK), roughness: 0.6 }),
    }),
    [],
  );

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      mats.body.dispose();
      mats.dark.dispose();
    };
  }, [mats]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (torso.current) torso.current.scale.y = 1 + Math.sin(t * 1.6) * 0.02;
    if (head.current) {
      // idle + olhar seguindo o cursor
      head.current.rotation.z = Math.sin(t * 0.8) * 0.04 + pointer.current.y * 0.12;
      head.current.rotation.y = pointer.current.x * 0.3;
      head.current.rotation.x = -0.05 + Math.sin(t * 0.6) * 0.03;
    }
    if (tail.current) tail.current.rotation.z = 0.7 + Math.sin(t * 7) * 0.45;
    if (earL.current) earL.current.rotation.x = 0.2 + Math.sin(t * 1.4) * 0.07;
    if (earR.current) earR.current.rotation.x = 0.2 + Math.sin(t * 1.4 + 0.5) * 0.07;
    if (root.current) root.current.position.y = position[1] + Math.sin(t * 1.1) * 0.02;
  });

  return (
    <group ref={root} position={position} scale={scale} rotation={[0, 0.5, 0]}>
      <mesh ref={torso} rotation={[0, 0, Math.PI / 2]} material={mats.body}>
        <capsuleGeometry args={[0.52, 1.9, 8, 16]} />
      </mesh>
      <mesh position={[1.15, 0.28, 0]} material={mats.body}>
        <sphereGeometry args={[0.55, 16, 16]} />
      </mesh>
      <group ref={head} position={[1.65, 0.62, 0]}>
        <mesh material={mats.body}>
          <sphereGeometry args={[0.5, 20, 20]} />
        </mesh>
        <mesh position={[0.5, -0.12, 0]} material={mats.body}>
          <boxGeometry args={[0.62, 0.34, 0.4]} />
        </mesh>
        <mesh position={[0.84, -0.1, 0]} material={mats.dark}>
          <sphereGeometry args={[0.11, 12, 12]} />
        </mesh>
        <mesh position={[0.28, 0.14, 0.26]} material={mats.dark}>
          <sphereGeometry args={[0.07, 10, 10]} />
        </mesh>
        <mesh position={[0.28, 0.14, -0.26]} material={mats.dark}>
          <sphereGeometry args={[0.07, 10, 10]} />
        </mesh>
        <mesh ref={earL} position={[-0.05, 0.05, 0.42]} scale={[0.5, 1.25, 0.9]} material={mats.body}>
          <sphereGeometry args={[0.34, 14, 14]} />
        </mesh>
        <mesh ref={earR} position={[-0.05, 0.05, -0.42]} scale={[0.5, 1.25, 0.9]} material={mats.body}>
          <sphereGeometry args={[0.34, 14, 14]} />
        </mesh>
      </group>
      <mesh ref={tail} position={[-1.15, 0.15, 0]} material={mats.body}>
        <coneGeometry args={[0.12, 1, 12]} />
      </mesh>
      {[
        [0.85, -0.35],
        [0.45, 0.35],
        [-0.6, -0.35],
        [-0.95, 0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.75, z]} material={mats.body}>
          <cylinderGeometry args={[0.15, 0.15, 0.7, 12]} />
        </mesh>
      ))}
    </group>
  );
};

export default BanModel;
