import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SectionWireSceneProps {
  variant: "cup" | "cheese";
  className?: string;
}

const SectionWireScene = ({ variant, className = "" }: SectionWireSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const wireMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("hsl(227, 87%, 34%)"),
      transparent: true,
      opacity: 0.84,
    });
    const meshWireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("hsl(227, 87%, 34%)"),
      wireframe: true,
      transparent: true,
      opacity: 0.68,
    });
    const cupLineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("hsl(227, 87%, 34%)"),
      transparent: true,
      opacity: 0.82,
    });

    const group = new THREE.Group();
    scene.add(group);

    if (variant === "cup") {
      const createAmericanCup = () => {
        const cup = new THREE.Group();

        // Profile inspired by Brazilian "copo americano":
        // rounded rim, tapered body, no middle bulge.
        const profile: THREE.Vector2[] = [
          new THREE.Vector2(0.54, -1.52),
          new THREE.Vector2(0.7, -1.47),
          new THREE.Vector2(0.78, -0.9),
          new THREE.Vector2(0.86, -0.2),
          new THREE.Vector2(0.94, 0.56),
          new THREE.Vector2(1.02, 1.2),
          new THREE.Vector2(1.1, 1.4),
        ];

        const outer = new THREE.EdgesGeometry(new THREE.LatheGeometry(profile, 20));
        const outerMesh = new THREE.LineSegments(outer, cupLineMat);
        cup.add(outerMesh);

        // Inner wall to create visible glass thickness.
        const innerProfile: THREE.Vector2[] = [
          new THREE.Vector2(0.58, -1.4),
          new THREE.Vector2(0.72, -0.95),
          new THREE.Vector2(0.79, -0.18),
          new THREE.Vector2(0.87, 0.54),
          new THREE.Vector2(0.95, 1.18),
        ];
        const inner = new THREE.EdgesGeometry(new THREE.LatheGeometry(innerProfile, 20));
        const innerMesh = new THREE.LineSegments(inner, cupLineMat);
        cup.add(innerMesh);

        // Rim ring
        const rim = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.TorusGeometry(1.06, 0.05, 10, 28)),
          cupLineMat,
        );
        rim.position.y = 1.35;
        rim.rotation.x = Math.PI / 2;
        cup.add(rim);

        // Bottom relief ring
        const base = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.TorusGeometry(0.64, 0.045, 12, 42)),
          cupLineMat,
        );
        base.position.y = -1.46;
        base.rotation.x = Math.PI / 2;
        cup.add(base);

        const ribCount = 10;
        const ribPositions: number[] = [];
        for (let i = 0; i < ribCount; i += 1) {
          const angle = (i / ribCount) * Math.PI * 2;
          const topR = 0.99;
          const midR = 0.79;
          const bottomR = 0.58;
          ribPositions.push(
            Math.cos(angle) * topR, 1.03, Math.sin(angle) * topR,
            Math.cos(angle) * midR, -0.18, Math.sin(angle) * midR,
          );
          ribPositions.push(
            Math.cos(angle) * midR, -0.18, Math.sin(angle) * midR,
            Math.cos(angle) * bottomR, -1.2, Math.sin(angle) * bottomR,
          );
        }
        const ribsGeometry = new THREE.BufferGeometry();
        ribsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(ribPositions, 3));
        const ribs = new THREE.LineSegments(ribsGeometry, wireMat);
        cup.add(ribs);

        return cup;
      };

      const cupA = createAmericanCup();
      const cupB = createAmericanCup();

      cupA.position.set(-1.35, 0.1, 0.15);
      cupA.rotation.z = 0.18;
      cupA.rotation.x = 0.05;

      cupB.position.set(1.48, -0.1, -1.25);
      cupB.rotation.z = -0.26;
      cupB.rotation.x = -0.08;

      group.add(cupA, cupB);
    } else {
      const createCheese = () => {
        const cheese = new THREE.Group();
        const meshMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color("hsl(227, 87%, 34%)"),
          wireframe: true,
          transparent: true,
          opacity: 0.86,
        });
        const holeWire = new THREE.LineBasicMaterial({
          color: new THREE.Color("hsl(227, 87%, 34%)"),
          transparent: true,
          opacity: 0.95,
        });

        // Swiss-like wedge profile closer to reference silhouette.
        const profile: THREE.Vector2[] = [
          new THREE.Vector2(0.0, 0.0),
          new THREE.Vector2(3.9, 0.0),
          new THREE.Vector2(3.78, 0.5),
          new THREE.Vector2(3.3, 0.86),
          new THREE.Vector2(2.62, 1.2),
          new THREE.Vector2(1.7, 1.44),
          new THREE.Vector2(0.72, 1.52),
          new THREE.Vector2(0.0, 1.38),
        ];
        const shape = new THREE.Shape(profile);
        // Front bite notch.
        shape.absarc(3.72, 0.16, 0.2, Math.PI * 0.1, Math.PI * 1.18, false);

        const extrude = new THREE.ExtrudeGeometry(shape, {
          depth: 2.35,
          steps: 3,
          bevelEnabled: true,
          bevelThickness: 0.08,
          bevelSize: 0.08,
          bevelSegments: 3,
          curveSegments: 28,
        });
        const body = new THREE.Mesh(extrude, meshMat);
        body.geometry.center();
        cheese.add(body);

        // Wireframe hole tunnels: front ring + back ring + spokes.
        const addHoleTunnel = (x: number, y: number, r: number, depth = 0.86, segments = 18) => {
          const frontZ = 1.15;
          const backZ = frontZ - depth;
          const frontPts: number[] = [];
          const backPts: number[] = [];
          const spokes: number[] = [];
          for (let i = 0; i <= segments; i += 1) {
            const a = (i / segments) * Math.PI * 2;
            const px = x + Math.cos(a) * r;
            const py = y + Math.sin(a) * r;
            frontPts.push(px, py, frontZ);
            backPts.push(px, py, backZ);
          }
          for (let i = 0; i < segments; i += 3) {
            const a = (i / segments) * Math.PI * 2;
            const px = x + Math.cos(a) * r;
            const py = y + Math.sin(a) * r;
            spokes.push(px, py, frontZ, px, py, backZ);
          }

          const frontGeom = new THREE.BufferGeometry();
          frontGeom.setAttribute("position", new THREE.Float32BufferAttribute(frontPts, 3));
          cheese.add(new THREE.Line(frontGeom, holeWire));

          const backGeom = new THREE.BufferGeometry();
          backGeom.setAttribute("position", new THREE.Float32BufferAttribute(backPts, 3));
          cheese.add(new THREE.Line(backGeom, holeWire));

          const spokeGeom = new THREE.BufferGeometry();
          spokeGeom.setAttribute("position", new THREE.Float32BufferAttribute(spokes, 3));
          cheese.add(new THREE.LineSegments(spokeGeom, holeWire));
        };

        const holeData = [
          { x: -1.08, y: 0.52, r: 0.26, d: 0.9 },
          { x: -0.42, y: 0.26, r: 0.2, d: 0.78 },
          { x: 0.38, y: 0.28, r: 0.25, d: 0.95 },
          { x: 1.05, y: 0.08, r: 0.18, d: 0.72 },
          { x: -0.72, y: -0.22, r: 0.15, d: 0.62 },
          { x: -0.1, y: -0.28, r: 0.14, d: 0.58 },
          { x: 0.56, y: -0.08, r: 0.13, d: 0.54 },
          { x: 1.38, y: -0.02, r: 0.11, d: 0.46 },
        ];
        holeData.forEach(({ x, y, r, d }) => {
          addHoleTunnel(x, y, r, d);
        });

        return cheese;
      };

      const flying = [
        { x: -1.52, y: 0.26, z: 0.12, rx: 0.18, ry: -0.26, rz: 0.16, s: 1.02 },
        { x: 1.1, y: -0.3, z: -1.2, rx: -0.1, ry: 0.3, rz: -0.2, s: 0.84 },
        { x: 0.2, y: 1.05, z: -2.05, rx: 0.07, ry: -0.18, rz: 0.1, s: 0.66 },
      ];

      flying.forEach((f) => {
        const slice = createCheese();
        slice.position.set(f.x, f.y, f.z);
        slice.rotation.set(f.rx, f.ry, f.rz);
        slice.scale.setScalar(f.s);
        group.add(slice);
      });
    }

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.34;
      group.rotation.x = Math.sin(t * 0.5) * 0.12;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      wireMat.dispose();
      cupLineMat.dispose();
      meshWireMat.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return <div ref={mountRef} className={`pointer-events-none ${className}`} aria-hidden />;
};

export default SectionWireScene;
