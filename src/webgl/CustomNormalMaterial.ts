import * as THREE from "three";

// Material de NORMAIS pro passe do Moebius (post do Maxime Heckel):
// - RGB = normal em view-space codificada (0.5 + 0.5*N) -> o Sobel nas normais
//   dá os contornos INTERNOS.
// - Blinn-Phong embutido: onde o specular passa do limite, joga BRANCO, pra o
//   Sobel contornar o brilho (specular moebius).
// - Alfa = difuso (luminância), usado depois pra modular a densidade da hachura.
const vertexShader = /* glsl */ `
  varying vec3 vNormalView;
  varying vec3 vViewPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    vNormalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLightDirWorld;
  uniform float uSpecThreshold;
  uniform float uShininess;
  varying vec3 vNormalView;
  varying vec3 vViewPos;
  void main() {
    vec3 N = normalize(vNormalView);
    vec3 V = normalize(-vViewPos);
    vec3 L = normalize((viewMatrix * vec4(uLightDirWorld, 0.0)).xyz);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), uShininess);
    float diff = max(dot(N, L), 0.0);
    vec3 col = N * 0.5 + 0.5;
    if (spec > uSpecThreshold) col = vec3(1.0);
    gl_FragColor = vec4(col, diff);
  }
`;

export class CustomNormalMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uLightDirWorld: { value: new THREE.Vector3(4.5, 6, 3.5).normalize() },
        uSpecThreshold: { value: 0.55 },
        uShininess: { value: 40 },
      },
      vertexShader,
      fragmentShader,
    });
  }
}
