import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import BanModel from "./BanModel";

// Estudio-diorama do Ban: um quarto retrocomputador em corte (chao + duas
// paredes), com mesa, CRTs mostrando o boot, cabos, posteres e o Ban vivendo
// dentro. A camera passeia pela cena com o scroll (motor narrativo) e faz
// parallax com o cursor. Tudo low-poly; o dither unifica e da a atmosfera.

const NEUTRAL = "#8a8a8a";
const WALL = "#6f6f6f";
const DESK = "#7a7a7a";
const CASE = "#565656";
const PHOSPHOR = "#0b2ca2";

// Um CRT: gabinete + tela acesa (phosphor) com "linhas de boot" escuras
const Crt = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation as unknown as THREE.Euler}>
    <mesh>
      <boxGeometry args={[1.5, 1.2, 1.2]} />
      <meshStandardMaterial color={CASE} roughness={0.7} />
    </mesh>
    <mesh position={[0, 0.05, 0.62]}>
      <planeGeometry args={[1.15, 0.85]} />
      <meshBasicMaterial color={PHOSPHOR} />
    </mesh>
    {[0.25, 0.05, -0.15].map((y) => (
      <mesh key={y} position={[-0.15, y + 0.05, 0.63]}>
        <planeGeometry args={[0.7, 0.06]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
    ))}
    <mesh position={[0, -0.75, 0]}>
      <boxGeometry args={[0.8, 0.3, 0.7]} />
      <meshStandardMaterial color={CASE} roughness={0.7} />
    </mesh>
  </group>
);

const DioramaScene = () => {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  // Cabo curvo de um CRT para o chao
  const cableGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, -0.6, -1.6),
      new THREE.Vector3(-1.8, -1.4, -1.2),
      new THREE.Vector3(-1.2, -1.7, -0.4),
      new THREE.Vector3(-0.3, -1.72, 0.6),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.05, 6, false);
  }, []);

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
    // Scroll conduz a camera de um plano geral para dentro da cena;
    // o cursor faz parallax discreto por cima.
    const p = scroll.current;
    const px = pointer.current.x;
    const py = pointer.current.y;
    const targetPos = new THREE.Vector3(
      -3.2 + p * 2.2 + px * 0.8,
      1.4 - p * 0.7 + py * 0.5,
      7.5 - p * 3.4,
    );
    camera.position.lerp(targetPos, 0.06);
    camera.lookAt(0.4 + px * 0.4, -0.2, 0);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 5, 5]} intensity={2.6} />
      <directionalLight position={[5, 2, -1]} intensity={1.6} />
      <pointLight position={[-1.2, 0.4, 2.2]} intensity={18} distance={9} color="#4a6bd8" />

      {/* Quarto em corte: chao + parede de fundo + parede lateral */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.75, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color={NEUTRAL} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, -3.2]}>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4.6, 2.5, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>

      {/* Posteres na parede de fundo (molduras phosphor) */}
      {[[-2.2, 3], [1.6, 2.8]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -3.15]}>
          <planeGeometry args={[1.4, 1.9]} />
          <meshBasicMaterial color={i === 0 ? PHOSPHOR : CASE} />
        </mesh>
      ))}

      {/* Mesa contra a parede */}
      <group position={[0, -0.5, -2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[6, 0.2, 1.6]} />
          <meshStandardMaterial color={DESK} roughness={0.8} />
        </mesh>
        {[[-2.8, -0.6], [2.8, -0.6], [-2.8, 0.6], [2.8, 0.6]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.2, z]}>
            <boxGeometry args={[0.15, 1.2, 0.15]} />
            <meshStandardMaterial color={DESK} roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Os CRTs em cima da mesa */}
      <Crt position={[-1.6, 0.55, -1.9]} rotation={[0, 0.3, 0]} />
      <Crt position={[1.7, 0.55, -2] as [number, number, number]} rotation={[0, -0.35, 0]} />

      {/* Cabo */}
      <mesh geometry={cableGeo}>
        <meshStandardMaterial color={CASE} roughness={0.7} />
      </mesh>

      {/* Tapete e o Ban vivendo na cena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, -1.72, 0.8]}>
        <planeGeometry args={[4.4, 2.6]} />
        <meshStandardMaterial color={CASE} roughness={0.95} />
      </mesh>
      <BanModel position={[0.6, -1, 0.9]} scale={0.62} />
    </>
  );
};

export default DioramaScene;
