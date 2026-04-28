import { useEffect, useRef } from "react";
import * as THREE from "three";

const BrutalistThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 220);
    camera.position.set(0, 0, 21);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const foregroundWire = new THREE.LineBasicMaterial({
      color: new THREE.Color("hsl(0, 0%, 12%)"),
      transparent: true,
      opacity: 0.34,
    });
    const primaryWire = new THREE.LineBasicMaterial({
      color: new THREE.Color("hsl(227, 87%, 34%)"),
      transparent: true,
      opacity: 0.78,
    });

    // Structured tunnel: repeated frames to suggest depth.
    for (let i = 0; i < 10; i += 1) {
      const size = 20 - i * 1.45;
      const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size * 0.62, 0.04));
      const frame = new THREE.LineSegments(geometry, i % 3 === 0 ? primaryWire : foregroundWire);
      frame.position.z = -i * 2.5;
      frame.rotation.z = i * 0.012;
      rootGroup.add(frame);
    }

    // Minimal wire objects inspired by references.
    const wireObjects = new THREE.Group();
    rootGroup.add(wireObjects);

    const cupLineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("hsl(227, 87%, 34%)"),
      transparent: true,
      opacity: 0.78,
    });
    const cupRibMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("hsl(227, 87%, 34%)"),
      transparent: true,
      opacity: 0.9,
    });

    const createAmericanCup = () => {
      const cup = new THREE.Group();
      const profile: THREE.Vector2[] = [
        // Cup americano: base menor e subida mais reta, sem "barriga" central.
        new THREE.Vector2(0.54, -1.52),
        new THREE.Vector2(0.7, -1.47),
        new THREE.Vector2(0.78, -0.9),
        new THREE.Vector2(0.86, -0.2),
        new THREE.Vector2(0.94, 0.56),
        new THREE.Vector2(1.02, 1.2),
        new THREE.Vector2(1.1, 1.4),
      ];
      const outer = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.LatheGeometry(profile, 20)),
        cupLineMaterial,
      );
      cup.add(outer);

      const innerProfile: THREE.Vector2[] = [
        new THREE.Vector2(0.58, -1.4),
        new THREE.Vector2(0.72, -0.95),
        new THREE.Vector2(0.79, -0.18),
        new THREE.Vector2(0.87, 0.54),
        new THREE.Vector2(0.95, 1.18),
      ];
      const inner = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.LatheGeometry(innerProfile, 20)),
        cupLineMaterial,
      );
      cup.add(inner);

      const rim = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.TorusGeometry(1.06, 0.05, 10, 28)),
        cupLineMaterial,
      );
      rim.position.y = 1.36;
      rim.rotation.x = Math.PI / 2;
      cup.add(rim);

      // Vertical faceted ribs.
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
          Math.cos(angle) * bottomR, -1.22, Math.sin(angle) * bottomR,
        );
      }
      const ribGeometry = new THREE.BufferGeometry();
      ribGeometry.setAttribute("position", new THREE.Float32BufferAttribute(ribPositions, 3));
      const ribs = new THREE.LineSegments(ribGeometry, cupRibMaterial);
      cup.add(ribs);

      return cup;
    };

    for (let i = 0; i < 5; i += 1) {
      const cup = createAmericanCup();
      cup.position.set(-6 + i * 2.8, 2.85 - i * 0.32, -4.3 - i * 1.9);
      cup.rotation.z = i % 2 === 0 ? 0.26 : -0.22;
      cup.rotation.x = 0.15;
      wireObjects.add(cup);
    }

    const deviceObjects = new THREE.Group();
    rootGroup.add(deviceObjects);

    const createNotebook = () => {
      const notebook = new THREE.Group();
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color("hsl(227, 87%, 34%)"),
        transparent: true,
        opacity: 0.72,
      });

      const screen = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4, 2.2, 0.12)),
        lineMat,
      );
      screen.position.set(0, 0.7, 0);
      screen.rotation.x = -0.38;

      const base = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(3.8, 0.14, 2.4)),
        lineMat,
      );
      base.position.set(0, -0.5, 0.4);

      notebook.add(screen, base);
      return notebook;
    };

    const createPhone = () => {
      const phone = new THREE.Group();
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color("hsl(0, 0%, 12%)"),
        transparent: true,
        opacity: 0.55,
      });
      const body = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.15, 2.28, 0.1)),
        lineMat,
      );
      const bezel = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.92, 1.86, 0.11)),
        lineMat,
      );
      bezel.position.z = 0.01;
      phone.add(body, bezel);
      return phone;
    };

    const notebook = createNotebook();
    notebook.position.set(5.4, -1.2, -6.8);
    notebook.rotation.y = -0.36;
    notebook.rotation.x = 0.18;
    deviceObjects.add(notebook);

    const phone = createPhone();
    phone.position.set(-5.2, -2.1, -5.6);
    phone.rotation.y = 0.48;
    phone.rotation.z = -0.12;
    deviceObjects.add(phone);

    const targetRotation = new THREE.Vector2(0, 0);
    const currentRotation = new THREE.Vector2(0, 0);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotation.x = ny * 0.08;
      targetRotation.y = nx * 0.09;
    };

    const handleResize = () => {
      const { clientWidth, clientHeight } = mount;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    handleResize();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.045;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.045;

      rootGroup.rotation.x = currentRotation.x;
      rootGroup.rotation.y = currentRotation.y;
      rootGroup.position.z = Math.sin(elapsed * 0.2) * 0.18;

      wireObjects.rotation.z = elapsed * 0.018;
      wireObjects.position.y = Math.sin(elapsed * 0.45) * 0.1;

      deviceObjects.rotation.y = -currentRotation.y * 0.7;
      deviceObjects.rotation.x = currentRotation.x * 0.4;
      deviceObjects.position.y = Math.sin(elapsed * 0.35) * 0.08;

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      foregroundWire.dispose();
      primaryWire.dispose();
      cupLineMaterial.dispose();
      cupRibMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-[1] pointer-events-none" aria-hidden />;
};

export default BrutalistThreeScene;
