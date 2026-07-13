import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildAmericanCup, disposeGroup, PHOSPHOR } from "./wireObjects";

// Dupla de copos americanos wireframe da secao de servicos, renderizada
// atraves do modo ASCII da assinatura.
const buildCups = () => {
  const group = new THREE.Group();
  const line = new THREE.LineBasicMaterial({
    color: new THREE.Color(PHOSPHOR),
    transparent: true,
    opacity: 0.84,
  });
  const rib = new THREE.LineBasicMaterial({
    color: new THREE.Color(PHOSPHOR),
    transparent: true,
    opacity: 0.9,
  });

  const cupA = buildAmericanCup(line, rib);
  cupA.position.set(-1.35, 0.1, 0.15);
  cupA.rotation.z = 0.18;
  cupA.rotation.x = 0.05;

  const cupB = buildAmericanCup(line, rib);
  cupB.position.set(1.48, -0.1, -1.25);
  cupB.rotation.z = -0.26;
  cupB.rotation.x = -0.08;

  group.add(cupA, cupB);
  return { group, materials: [line, rib] };
};

const WireCupScene = () => {
  const { group, materials } = useMemo(buildCups, []);

  useEffect(() => {
    return () => disposeGroup(group, materials);
  }, [group, materials]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.34;
    group.rotation.x = Math.sin(t * 0.5) * 0.12;
  });

  return <primitive object={group} />;
};

export default WireCupScene;
