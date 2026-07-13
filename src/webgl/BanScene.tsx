import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Ban 3D procedural: um dachshund low-poly montado a partir de primitivas,
// com idle real (respiro, rabo, orelhas, cabeca) num ambiente composto, e
// uma luz que segue o cursor (mouse-reveal). A cara final vem do pipeline
// de dither; aqui existe forma e luz.

const BODY = "#9a9a9a";
const DARK = "#141414";

const BanScene = () => {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const earL = useRef<THREE.Mesh>(null);
  const earR = useRef<THREE.Mesh>(null);
  const revealLight = useRef<THREE.PointLight>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

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
    if (root.current) {
      root.current.position.y = -0.4 + Math.sin(t * 1.1) * 0.03;
      // parallax discreto de 3/4 seguindo o cursor
      root.current.rotation.y += (0.5 + pointer.current.x * 0.35 - root.current.rotation.y) * 0.04;
    }
    if (torso.current) torso.current.scale.y = 1 + Math.sin(t * 1.6) * 0.02;
    if (head.current) {
      head.current.rotation.z = Math.sin(t * 0.8) * 0.05;
      head.current.rotation.x = -0.05 + Math.sin(t * 0.6) * 0.03;
    }
    if (tail.current) tail.current.rotation.z = 0.7 + Math.sin(t * 7) * 0.45;
    if (earL.current) earL.current.rotation.x = 0.2 + Math.sin(t * 1.4) * 0.07;
    if (earR.current) earR.current.rotation.x = 0.2 + Math.sin(t * 1.4 + 0.5) * 0.07;

    // mouse-reveal: a luz caminha ate onde o cursor aponta
    if (revealLight.current) {
      const target = new THREE.Vector3(pointer.current.x, pointer.current.y, 0.6).unproject(camera);
      revealLight.current.position.lerp(new THREE.Vector3(target.x, target.y + 1, 3.4), 0.08);
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[-3, 4, 4]} intensity={3.2} />
      <directionalLight position={[4, 2, -2]} intensity={2.2} />
      <pointLight ref={revealLight} intensity={90} distance={12} color="#ffffff" />

      {/* Ambiente composto: um chao que aterra o Ban (o fundo escuro e a tela) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]} material={mats.dark}>
        <planeGeometry args={[40, 40]} />
      </mesh>

      <group ref={root} rotation={[0, 0.5, 0]}>
        {/* Torso longo (a salsicha) */}
        <mesh ref={torso} rotation={[0, 0, Math.PI / 2]} material={mats.body}>
          <capsuleGeometry args={[0.52, 1.9, 8, 16]} />
        </mesh>

        {/* Peito subindo para a frente */}
        <mesh position={[1.15, 0.28, 0]} material={mats.body}>
          <sphereGeometry args={[0.55, 16, 16]} />
        </mesh>

        {/* Cabeca */}
        <group ref={head} position={[1.65, 0.62, 0]}>
          <mesh material={mats.body}>
            <sphereGeometry args={[0.5, 20, 20]} />
          </mesh>
          {/* Focinho */}
          <mesh position={[0.5, -0.12, 0]} material={mats.body}>
            <boxGeometry args={[0.62, 0.34, 0.4]} />
          </mesh>
          {/* Nariz */}
          <mesh position={[0.84, -0.1, 0]} material={mats.dark}>
            <sphereGeometry args={[0.11, 12, 12]} />
          </mesh>
          {/* Olhos */}
          <mesh position={[0.28, 0.14, 0.26]} material={mats.dark}>
            <sphereGeometry args={[0.07, 10, 10]} />
          </mesh>
          <mesh position={[0.28, 0.14, -0.26]} material={mats.dark}>
            <sphereGeometry args={[0.07, 10, 10]} />
          </mesh>
          {/* Orelhas caidas */}
          <mesh ref={earL} position={[-0.05, 0.05, 0.42]} scale={[0.5, 1.25, 0.9]} material={mats.body}>
            <sphereGeometry args={[0.34, 14, 14]} />
          </mesh>
          <mesh ref={earR} position={[-0.05, 0.05, -0.42]} scale={[0.5, 1.25, 0.9]} material={mats.body}>
            <sphereGeometry args={[0.34, 14, 14]} />
          </mesh>
        </group>

        {/* Rabo */}
        <mesh ref={tail} position={[-1.15, 0.15, 0]} material={mats.body}>
          <coneGeometry args={[0.12, 1, 12]} />
        </mesh>

        {/* 4 patas curtas */}
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
    </>
  );
};

export default BanScene;
