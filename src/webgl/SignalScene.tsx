import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// SINAL: um campo de onda wireframe (entre osciloscopio e topografia),
// deformado por ruido simplex no vertex shader. A cara final vem do
// pos-processamento; aqui so existe o sinal em phosphor.

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying float vElev;

  // Simplex 2D (Ashima Arts / Ian McEwan, dominio publico)
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec3 pos = position;
    float wave = snoise(pos.xy * 0.055 + vec2(uTime * 0.10, uTime * 0.045));
    float detail = snoise(pos.xy * 0.19 - vec2(0.0, uTime * 0.08));
    float elev = wave * 2.6 + detail * 0.8;
    pos.z += elev;
    vElev = elev;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uPhosphor;
  varying float vElev;

  void main() {
    // Elevacao vira intensidade: os picos acendem, os vales apagam.
    // E o gradiente que o dither transforma em textura.
    float h = smoothstep(-3.0, 3.2, vElev);
    gl_FragColor = vec4(uPhosphor * (0.3 + 1.1 * h), 0.92);
  }
`;

const SignalScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(96, 52, 120, 60);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uPhosphor: { value: new THREE.Color("hsl(227, 87%, 34%)") },
      },
    });
    return { geometry, material };
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    const group = groupRef.current;
    if (!group) return;
    // Deriva lenta da camera + parallax discreto do cursor
    group.rotation.y += (pointer.current.x * 0.06 - group.rotation.y) * 0.03;
    group.rotation.x += (-1.24 + pointer.current.y * 0.03 - group.rotation.x) * 0.03;
    group.position.x = Math.sin(clock.getElapsedTime() * 0.05) * 1.6;
  });

  return (
    <group ref={groupRef} position={[0, -7.5, -6]} rotation={[-1.24, 0, 0]}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
};

export default SignalScene;
