import * as THREE from "three";

// Material de NORMAIS pro passe do Moebius (post do Maxime Heckel):
// - RGB = normal em view-space codificada (0.5 + 0.5*N) -> o Sobel nas normais
//   dá os contornos INTERNOS.
// - Blinn-Phong embutido: onde o specular passa do limite, joga BRANCO, pra o
//   Sobel contornar o brilho (specular moebius).
// - Alfa = PROFUNDIDADE LINEAR (view-Z) em float -> o Sobel nela dá os contornos
//   EXTERNOS sem o banding do depth buffer do composer.
// IMPORTANTE: este material e usado como scene.overrideMaterial no passe de
// normais. Se ele nao souber deformar mesh SKINADO, o Moebius desenha contorno
// e hachura a partir da BIND POSE -> num personagem animado voce ve dois caes:
// a silhueta rigida arrastando e a malha animada por dentro. Os chunks abaixo
// sao os do proprio three; o define USE_SKINNING entra sozinho em SkinnedMesh
// (e some no resto, entao mesh normal nao paga nada).
const vertexShader = /* glsl */ `
  #include <common>
  #include <skinning_pars_vertex>

  varying vec3 vNormalView;
  varying vec3 vViewPos;

  void main() {
    vec3 objectNormal = normalize(normal);
    vec3 transformed = position;

    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <skinning_vertex>

    vNormalView = normalize(normalMatrix * objectNormal);
    vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
    vViewPos = mv.xyz;
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
    vec3 col = N * 0.5 + 0.5;
    if (spec > uSpecThreshold) col = vec3(1.0);
    // alfa = profundidade linear (distancia positiva ate a camera)
    gl_FragColor = vec4(col, -vViewPos.z);
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
