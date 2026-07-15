import * as THREE from "three";
import { Effect, EffectAttribute } from "postprocessing";
import { CustomNormalMaterial } from "./CustomNormalMaterial";

// Passe Moebius (full-res, ANTES de pixelizar/ditherizar) — fiel ao post do
// Maxime Heckel. Buffers: normais (rgb) + profundidade linear (alfa). Contornos
// por Sobel; wobble desenhado a mao; sombras por cross-hatch (sem shadow map).
// modo: 0 = moebius, 1 = normais, 2 = profundidade.
const fragmentShader = /* glsl */ `
  uniform sampler2D uNormalBuffer;
  uniform float uDebug;
  uniform float uCamNear;
  uniform float uCamFar;
  uniform vec2 uTexel;
  uniform vec2 uResolution;
  uniform float uOutlineThickness;
  uniform float uDepthScale;
  uniform float uNormalScale;
  uniform float uWobbleAmp;
  uniform float uWobbleFreq;
  uniform float uHatch;
  uniform float uHatchSpacing;
  uniform float uHatchLevel;
  uniform vec3 uOutlineColor;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float luma(vec3 c) { return dot(c, vec3(0.2125, 0.7154, 0.0721)); }
  float d01(float lin) { return clamp((lin - uCamNear) / (uCamFar - uCamNear), 0.0, 1.0); }

  void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    if (uDebug > 1.5) {
      float ld = texture2D(uNormalBuffer, uv).a;
      outputColor = vec4(vec3(1.0 - clamp(ld / 8.0, 0.0, 1.0)), 1.0);
      return;
    }
    if (uDebug > 0.5) {
      outputColor = vec4(texture2D(uNormalBuffer, uv).rgb, 1.0);
      return;
    }

    // wobble desenhado a mao nas posicoes de amostragem do kernel
    vec2 wob = vec2(
      hash(gl_FragCoord.xy) * sin(gl_FragCoord.y * uWobbleFreq),
      hash(gl_FragCoord.xy) * cos(gl_FragCoord.x * uWobbleFreq)
    ) * uWobbleAmp / uResolution;

    vec2 o = uTexel * uOutlineThickness;
    vec4 s0 = texture2D(uNormalBuffer, uv + wob + o * vec2(-1.0, -1.0));
    vec4 s1 = texture2D(uNormalBuffer, uv + wob + o * vec2( 0.0, -1.0));
    vec4 s2 = texture2D(uNormalBuffer, uv + wob + o * vec2( 1.0, -1.0));
    vec4 s3 = texture2D(uNormalBuffer, uv + wob + o * vec2(-1.0,  0.0));
    vec4 s5 = texture2D(uNormalBuffer, uv + wob + o * vec2( 1.0,  0.0));
    vec4 s6 = texture2D(uNormalBuffer, uv + wob + o * vec2(-1.0,  1.0));
    vec4 s7 = texture2D(uNormalBuffer, uv + wob + o * vec2( 0.0,  1.0));
    vec4 s8 = texture2D(uNormalBuffer, uv + wob + o * vec2( 1.0,  1.0));

    // Sobel na profundidade normalizada (contorno externo)
    float a0 = d01(s0.a), a1 = d01(s1.a), a2 = d01(s2.a), a3 = d01(s3.a);
    float a5 = d01(s5.a), a6 = d01(s6.a), a7 = d01(s7.a), a8 = d01(s8.a);
    float ddx = (a2 + 2.0 * a5 + a8) - (a0 + 2.0 * a3 + a6);
    float ddy = (a6 + 2.0 * a7 + a8) - (a0 + 2.0 * a1 + a2);
    float gradDepth = sqrt(ddx * ddx + ddy * ddy);

    // Sobel nas normais (contorno interno)
    vec3 ndx = (s2.rgb + 2.0 * s5.rgb + s8.rgb) - (s0.rgb + 2.0 * s3.rgb + s6.rgb);
    vec3 ndy = (s6.rgb + 2.0 * s7.rgb + s8.rgb) - (s0.rgb + 2.0 * s1.rgb + s2.rgb);
    float gradNormal = sqrt(dot(ndx, ndx) + dot(ndy, ndy));

    float outline = clamp(gradDepth * uDepthScale + gradNormal * uNormalScale, 0.0, 1.0);
    if (depth > 0.999) outline = 0.0;

    // cross-hatch das sombras (3 camadas por luminancia)
    vec3 col = inputColor.rgb;
    if (uHatch > 0.5 && depth <= 0.99) {
      float lm = luma(inputColor.rgb);
      float sp = uHatchSpacing;
      float L = uHatchLevel;
      // so hachura em area de fato escura; mais escuro = mais camadas
      if (lm <= L && mod(uv.x * uResolution.y + uv.y * uResolution.x, sp) <= uOutlineThickness) col = uOutlineColor;
      if (lm <= L * 0.65 && mod(uv.x * uResolution.x, sp) <= uOutlineThickness) col = uOutlineColor;
      if (lm <= L * 0.4 && mod(uv.y * uResolution.y, sp) <= uOutlineThickness) col = uOutlineColor;
    }

    col = mix(col, uOutlineColor, outline);
    outputColor = vec4(col, 1.0);
  }
`;

export interface MoebiusOptions {
  debug?: number;
  specThreshold?: number;
  shininess?: number;
  outlineThickness?: number;
  depthScale?: number;
  normalScale?: number;
  wobbleAmp?: number;
  wobbleFreq?: number;
  hatch?: boolean;
}

export class MoebiusEffect extends Effect {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private normalRT: THREE.WebGLRenderTarget;
  private normalMaterial: CustomNormalMaterial;

  constructor(scene: THREE.Scene, camera: THREE.Camera, opts: MoebiusOptions = {}) {
    super("MoebiusEffect", fragmentShader, {
      // DEPTH: precisa do depth buffer. CONVOLUTION: forca passe proprio, pra o
      // passe retro (pixelizacao) rodar DEPOIS, sobre o resultado full-res.
      attributes: EffectAttribute.DEPTH | EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, THREE.Uniform>([
        ["uNormalBuffer", new THREE.Uniform(null)],
        ["uDebug", new THREE.Uniform(opts.debug ?? 0)],
        ["uCamNear", new THREE.Uniform(0.1)],
        ["uCamFar", new THREE.Uniform(15)],
        ["uTexel", new THREE.Uniform(new THREE.Vector2(1 / 1280, 1 / 720))],
        ["uResolution", new THREE.Uniform(new THREE.Vector2(1280, 720))],
        // valores calibrados e travados pelo Mateus
        ["uOutlineThickness", new THREE.Uniform(opts.outlineThickness ?? 1.3)],
        ["uDepthScale", new THREE.Uniform(opts.depthScale ?? 25.0)],
        ["uNormalScale", new THREE.Uniform(opts.normalScale ?? 1.0)],
        ["uWobbleAmp", new THREE.Uniform(opts.wobbleAmp ?? 3.0)],
        ["uWobbleFreq", new THREE.Uniform(opts.wobbleFreq ?? 0.06)],
        ["uHatch", new THREE.Uniform((opts.hatch ?? true) ? 1 : 0)],
        ["uHatchSpacing", new THREE.Uniform(8.0)],
        ["uHatchLevel", new THREE.Uniform(0.4)],
        ["uOutlineColor", new THREE.Uniform(new THREE.Color("#0d0d10"))],
      ]),
    });

    this.scene = scene;
    this.camera = camera;
    this.normalMaterial = new CustomNormalMaterial();
    this.normalMaterial.uniforms.uSpecThreshold.value = opts.specThreshold ?? 0.17;
    this.normalMaterial.uniforms.uShininess.value = opts.shininess ?? 36;
    this.normalRT = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      type: THREE.HalfFloatType,
    });
  }

  setSize(width: number, height: number) {
    this.normalRT.setSize(width, height);
    (this.uniforms.get("uTexel") as THREE.Uniform).value.set(1 / width, 1 / height);
    (this.uniforms.get("uResolution") as THREE.Uniform).value.set(width, height);
  }

  update(renderer: THREE.WebGLRenderer, _inputBuffer: THREE.WebGLRenderTarget, _dt: number) {
    const prevRT = renderer.getRenderTarget();
    const prevOverride = this.scene.overrideMaterial;
    this.scene.overrideMaterial = this.normalMaterial;
    renderer.setRenderTarget(this.normalRT);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = prevOverride;
    renderer.setRenderTarget(prevRT);

    (this.uniforms.get("uNormalBuffer") as THREE.Uniform).value = this.normalRT.texture;
    const cam = this.camera as THREE.PerspectiveCamera;
    (this.uniforms.get("uCamNear") as THREE.Uniform).value = cam.near ?? 0.1;
    (this.uniforms.get("uCamFar") as THREE.Uniform).value = cam.far ?? 15;
  }

  set debug(v: number) { (this.uniforms.get("uDebug") as THREE.Uniform).value = v; }
  set outlineThickness(v: number) { (this.uniforms.get("uOutlineThickness") as THREE.Uniform).value = v; }
  set depthScale(v: number) { (this.uniforms.get("uDepthScale") as THREE.Uniform).value = v; }
  set normalScale(v: number) { (this.uniforms.get("uNormalScale") as THREE.Uniform).value = v; }
  set wobbleAmp(v: number) { (this.uniforms.get("uWobbleAmp") as THREE.Uniform).value = v; }
  set wobbleFreq(v: number) { (this.uniforms.get("uWobbleFreq") as THREE.Uniform).value = v; }
  set hatch(v: boolean) { (this.uniforms.get("uHatch") as THREE.Uniform).value = v ? 1 : 0; }
  set hatchSpacing(v: number) { (this.uniforms.get("uHatchSpacing") as THREE.Uniform).value = v; }
  set hatchLevel(v: number) { (this.uniforms.get("uHatchLevel") as THREE.Uniform).value = v; }
  set specThreshold(v: number) { this.normalMaterial.uniforms.uSpecThreshold.value = v; }
  set shininess(v: number) { this.normalMaterial.uniforms.uShininess.value = v; }

  dispose() {
    this.normalRT.dispose();
    this.normalMaterial.dispose();
    super.dispose();
  }
}
