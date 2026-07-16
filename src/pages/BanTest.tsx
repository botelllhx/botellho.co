import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF, OrbitControls, Grid } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

// PAGINA DE DIAGNOSTICO (temporaria). O Ban riggado SOZINHO: sem diorama, sem
// Moebius, sem retro, sem CRT. Se ele quebrar aqui, o problema e o glb. Se ficar
// bom aqui, o problema e a integracao. Nao ha onde o bug se esconder.
const BAN = "/3d/ban_rigged.glb";
const DRACO = "/draco/";
if (typeof window !== "undefined") useGLTF.preload(BAN, DRACO);

const Ban = () => {
  const { scene, animations } = useGLTF(BAN, DRACO);
  const { actions, names } = useAnimations(animations, scene);
  const { clipe, tocando, timeScale } = useControls("ban", {
    clipe: { value: "(bind pose)", options: ["(bind pose)", "walk", "idle"] },
    tocando: { value: true },
    timeScale: { value: 1, min: 0.05, max: 3, step: 0.05 },
  });

  useEffect(() => {
    scene.traverse((o) => {
      o.frustumCulled = false;
    });
  }, [scene]);

  useEffect(() => {
    Object.values(actions).forEach((a) => {
      a?.stop();
      a?.reset();
    });
    if (clipe === "(bind pose)") {
      // zera de fato: para tudo e devolve os ossos ao repouso do glb
      scene.traverse((o) => {
        const b = o as unknown as { isBone?: boolean };
        if (b.isBone) (o as unknown as { userData: Record<string, unknown> }).userData.rest = true;
      });
      return;
    }
    const a = actions[clipe];
    if (!a) return;
    a.reset();
    a.timeScale = timeScale;
    a.play();
    a.paused = !tocando;
  }, [actions, scene, clipe, tocando, timeScale]);

  // eslint-disable-next-line no-console
  console.log("[BANTEST] clipes disponiveis:", names);

  // mede o mesh JA SKINADO (boneTransform aplica o skinning por vertice).
  // se a bind pose e boa e isto estoura, o defeito esta na aplicacao dos clipes.
  useFrame(() => {
    const w = window as unknown as { __medir?: boolean; __bbox?: unknown };
    if (!w.__medir) return;
    w.__medir = false;
    let sk: THREE.SkinnedMesh | null = null;
    scene.traverse((o) => {
      const m = o as THREE.SkinnedMesh;
      if (m.isSkinnedMesh && !sk) sk = m;
    });
    if (!sk) return;
    const mesh = sk as THREE.SkinnedMesh;
    const v = new THREE.Vector3();
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    const pos = mesh.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 7) {
      v.fromBufferAttribute(pos, i);
      mesh.applyBoneTransform(i, v);
      min.min(v);
      max.max(v);
    }
    w.__bbox = {
      x: [+min.x.toFixed(3), +max.x.toFixed(3)],
      y: [+min.y.toFixed(3), +max.y.toFixed(3)],
      z: [+min.z.toFixed(3), +max.z.toFixed(3)],
    };
    // onde os OSSOS estao de fato? se eles estiverem certos e a malha esticar,
    // o defeito e skinning; se os ossos voarem, o defeito e a animacao.
    const p = new THREE.Vector3();
    const ossos: Record<string, number[]> = {};
    for (const b of mesh.skeleton.bones) {
      b.getWorldPosition(p);
      ossos[b.name] = [+p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3)];
    }
    (w as unknown as { __ossos: unknown }).__ossos = ossos;
  });

  // o glb sai na posicao do diorama (blender 0.95,-0.5,0 -> gltf 0.95,0,0.5).
  // NAO centralizo mexendo em osso (era isso que quebrava a animacao): centralizo
  // aqui, com um grupo. o pai fica sendo o pivo do cao.
  return (
    <group position={[-0.95, 0, -0.5]}>
      <primitive object={scene} />
    </group>
  );
};

const BanTest = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-screen w-full bg-neutral-400" />;

  return (
    <div className="h-screen w-full bg-neutral-400">
      {/* camera de PERFIL, comparavel ao contact sheet do Blender */}
      <Canvas camera={{ position: [1.6, 0.16, 0], fov: 40 }}>
        <color attach="background" args={["#9aa0a6"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 2]} intensity={2.2} />
        <Grid args={[4, 4]} cellSize={0.1} sectionSize={0.5} infiniteGrid fadeDistance={6} />
        <Suspense fallback={null}>
          <Ban />
        </Suspense>
        <OrbitControls target={[0, 0.15, 0]} />
      </Canvas>
    </div>
  );
};

export default BanTest;
