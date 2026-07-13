import * as THREE from "three";

// Objetos wireframe do estudio, compartilhados entre as cenas da assinatura.

export const PHOSPHOR = "hsl(227, 87%, 34%)";
export const INK = "hsl(0, 0%, 12%)";

// Copo americano: base menor e subida reta, sem barriga central.
export const buildAmericanCup = (
  lineMaterial: THREE.LineBasicMaterial,
  ribMaterial: THREE.LineBasicMaterial,
) => {
  const cup = new THREE.Group();
  const profile = [
    new THREE.Vector2(0.54, -1.52),
    new THREE.Vector2(0.7, -1.47),
    new THREE.Vector2(0.78, -0.9),
    new THREE.Vector2(0.86, -0.2),
    new THREE.Vector2(0.94, 0.56),
    new THREE.Vector2(1.02, 1.2),
    new THREE.Vector2(1.1, 1.4),
  ];
  cup.add(
    new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.LatheGeometry(profile, 20)), lineMaterial),
  );

  const innerProfile = [
    new THREE.Vector2(0.58, -1.4),
    new THREE.Vector2(0.72, -0.95),
    new THREE.Vector2(0.79, -0.18),
    new THREE.Vector2(0.87, 0.54),
    new THREE.Vector2(0.95, 1.18),
  ];
  cup.add(
    new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.LatheGeometry(innerProfile, 20)), lineMaterial),
  );

  const rim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.TorusGeometry(1.06, 0.05, 10, 28)),
    lineMaterial,
  );
  rim.position.y = 1.36;
  rim.rotation.x = Math.PI / 2;
  cup.add(rim);

  const ribCount = 10;
  const ribPositions: number[] = [];
  for (let i = 0; i < ribCount; i += 1) {
    const angle = (i / ribCount) * Math.PI * 2;
    ribPositions.push(
      Math.cos(angle) * 0.99, 1.03, Math.sin(angle) * 0.99,
      Math.cos(angle) * 0.79, -0.18, Math.sin(angle) * 0.79,
    );
    ribPositions.push(
      Math.cos(angle) * 0.79, -0.18, Math.sin(angle) * 0.79,
      Math.cos(angle) * 0.58, -1.22, Math.sin(angle) * 0.58,
    );
  }
  const ribGeometry = new THREE.BufferGeometry();
  ribGeometry.setAttribute("position", new THREE.Float32BufferAttribute(ribPositions, 3));
  cup.add(new THREE.LineSegments(ribGeometry, ribMaterial));

  return cup;
};

export const disposeGroup = (root: THREE.Object3D, materials: THREE.Material[]) => {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
  });
  materials.forEach((material) => material.dispose());
};
