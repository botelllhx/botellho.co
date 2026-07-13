import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildAmericanCup, disposeGroup, PHOSPHOR, INK } from "./wireObjects";

// Cena da assinatura do hero: o tunel de frames com os objetos wireframe do
// estudio (xicara americana, notebook, phone), portada da versao three pura.
// A cara final vem do pos-processamento (PhosphorDitherEffect), nao daqui.

interface SceneGraph {
  root: THREE.Group;
  wireObjects: THREE.Group;
  deviceObjects: THREE.Group;
  materials: THREE.Material[];
}

// Exportado tambem para gerar o fallback estatico dithered offscreen
export const buildScene = (): SceneGraph => {
  const root = new THREE.Group();

  const foregroundWire = new THREE.LineBasicMaterial({
    color: new THREE.Color(INK),
    transparent: true,
    opacity: 0.34,
  });
  const primaryWire = new THREE.LineBasicMaterial({
    color: new THREE.Color(PHOSPHOR),
    transparent: true,
    opacity: 0.78,
  });
  const cupLine = new THREE.LineBasicMaterial({
    color: new THREE.Color(PHOSPHOR),
    transparent: true,
    opacity: 0.78,
  });
  const cupRib = new THREE.LineBasicMaterial({
    color: new THREE.Color(PHOSPHOR),
    transparent: true,
    opacity: 0.9,
  });
  const deviceLine = new THREE.LineBasicMaterial({
    color: new THREE.Color(PHOSPHOR),
    transparent: true,
    opacity: 0.72,
  });
  const phoneLine = new THREE.LineBasicMaterial({
    color: new THREE.Color(INK),
    transparent: true,
    opacity: 0.55,
  });

  // Tunel de frames repetidos sugerindo profundidade
  for (let i = 0; i < 10; i += 1) {
    const size = 20 - i * 1.45;
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size * 0.62, 0.04));
    const frame = new THREE.LineSegments(geometry, i % 3 === 0 ? primaryWire : foregroundWire);
    frame.position.z = -i * 2.5;
    frame.rotation.z = i * 0.012;
    root.add(frame);
  }

  const wireObjects = new THREE.Group();
  root.add(wireObjects);
  for (let i = 0; i < 5; i += 1) {
    const cup = buildAmericanCup(cupLine, cupRib);
    cup.position.set(-6 + i * 2.8, 2.85 - i * 0.32, -4.3 - i * 1.9);
    cup.rotation.z = i % 2 === 0 ? 0.26 : -0.22;
    cup.rotation.x = 0.15;
    wireObjects.add(cup);
  }

  const deviceObjects = new THREE.Group();
  root.add(deviceObjects);

  const notebook = new THREE.Group();
  const screen = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4, 2.2, 0.12)),
    deviceLine,
  );
  screen.position.set(0, 0.7, 0);
  screen.rotation.x = -0.38;
  const base = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.8, 0.14, 2.4)),
    deviceLine,
  );
  base.position.set(0, -0.5, 0.4);
  notebook.add(screen, base);
  notebook.position.set(5.4, -1.2, -6.8);
  notebook.rotation.y = -0.36;
  notebook.rotation.x = 0.18;
  deviceObjects.add(notebook);

  const phone = new THREE.Group();
  const body = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.15, 2.28, 0.1)),
    phoneLine,
  );
  const bezel = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.92, 1.86, 0.11)),
    phoneLine,
  );
  bezel.position.z = 0.01;
  phone.add(body, bezel);
  phone.position.set(-5.2, -2.1, -5.6);
  phone.rotation.y = 0.48;
  phone.rotation.z = -0.12;
  deviceObjects.add(phone);

  return {
    root,
    wireObjects,
    deviceObjects,
    materials: [foregroundWire, primaryWire, cupLine, cupRib, deviceLine, phoneLine],
  };
};

const HeroTunnelScene = () => {
  const graph = useMemo(buildScene, []);
  const target = useRef(new THREE.Vector2(0, 0));
  const current = useRef(new THREE.Vector2(0, 0));

  // O canvas e pointer-events-none; o parallax escuta o mouse global
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      target.current.set(ny * 0.08, nx * 0.09);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const { root, materials } = graph;
    return () => disposeGroup(root, materials);
  }, [graph]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const { root, wireObjects, deviceObjects } = graph;

    current.current.x += (target.current.x - current.current.x) * 0.045;
    current.current.y += (target.current.y - current.current.y) * 0.045;

    root.rotation.x = current.current.x;
    root.rotation.y = current.current.y;
    root.position.z = Math.sin(elapsed * 0.2) * 0.18;

    wireObjects.rotation.z = elapsed * 0.018;
    wireObjects.position.y = Math.sin(elapsed * 0.45) * 0.1;

    deviceObjects.rotation.y = -current.current.y * 0.7;
    deviceObjects.rotation.x = current.current.x * 0.4;
    deviceObjects.position.y = Math.sin(elapsed * 0.35) * 0.08;
  });

  return <primitive object={graph.root} />;
};

export default HeroTunnelScene;
