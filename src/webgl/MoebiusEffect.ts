import * as THREE from "three";
import { Effect, EffectAttribute } from "postprocessing";
import { CustomNormalMaterial } from "./CustomNormalMaterial";

// Passe Moebius (full-res, ANTES de pixelizar/ditherizar), do post do Maxime.
// Etapa 3: buffers (normais + profundidade).
// Etapa 4a: contornos por Sobel 3x3 -> profundidade (contorno externo) * escala
// + normais (contorno interno). Wobble e cross-hatch entram na sequencia.
// modo: 0 = moebius (contornos), 1 = normais, 2 = profundidade.
const fragmentShader = /* glsl */ `
  uniform sampler2D uNormalBuffer;
  uniform float uDebug;
  uniform float uCamNear;
  uniform float uCamFar;
  uniform vec2 uTexel;
  uniform float uOutlineThickness;
  uniform float uDepthScale;
  uniform float uNormalScale;
  uniform float uThreshold;

  void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    // ---- debug ----
    if (uDebug > 1.5) {
      float ld = texture2D(uNormalBuffer, uv).a;
      outputColor = vec4(vec3(1.0 - clamp(ld / 8.0, 0.0, 1.0)), 1.0);
      return;
    }
    if (uDebug > 0.5) {
      outputColor = vec4(texture2D(uNormalBuffer, uv).rgb, 1.0);
      return;
    }

    // ---- Sobel 3x3 no buffer float (rgb = normais, a = profundidade linear) ----
    vec2 o = uTexel * uOutlineThickness;
    vec4 s0 = texture2D(uNormalBuffer, uv + o * vec2(-1.0, -1.0));
    vec4 s1 = texture2D(uNormalBuffer, uv + o * vec2( 0.0, -1.0));
    vec4 s2 = texture2D(uNormalBuffer, uv + o * vec2( 1.0, -1.0));
    vec4 s3 = texture2D(uNormalBuffer, uv + o * vec2(-1.0,  0.0));
    vec4 s5 = texture2D(uNormalBuffer, uv + o * vec2( 1.0,  0.0));
    vec4 s6 = texture2D(uNormalBuffer, uv + o * vec2(-1.0,  1.0));
    vec4 s7 = texture2D(uNormalBuffer, uv + o * vec2( 0.0,  1.0));
    vec4 s8 = texture2D(uNormalBuffer, uv + o * vec2( 1.0,  1.0));
    float gdx = (s2.a + 2.0 * s5.a + s8.a) - (s0.a + 2.0 * s3.a + s6.a);
    float gdy = (s6.a + 2.0 * s7.a + s8.a) - (s0.a + 2.0 * s1.a + s2.a);
    float edgeDepth = length(vec2(gdx, gdy));
    vec3 gnx = (s2.rgb + 2.0 * s5.rgb + s8.rgb) - (s0.rgb + 2.0 * s3.rgb + s6.rgb);
    vec3 gny = (s6.rgb + 2.0 * s7.rgb + s8.rgb) - (s0.rgb + 2.0 * s1.rgb + s2.rgb);
    float edgeNormal = length(gnx) + length(gny);

    float e = edgeDepth * uDepthScale + edgeNormal * uNormalScale;
    // so vira linha em descontinuidade real (limiar), nao na inclinacao suave
    float outline = smoothstep(uThreshold, uThreshold + 0.8, e);
    // nao contorna o vazio (plano de fundo)
    if (depth > 0.999) outline = 0.0;

    vec3 col = mix(inputColor.rgb, vec3(0.06, 0.06, 0.08), outline);
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
  threshold?: number;
}

export class MoebiusEffect extends Effect {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private normalRT: THREE.WebGLRenderTarget;
  private normalMaterial: CustomNormalMaterial;

  constructor(scene: THREE.Scene, camera: THREE.Camera, opts: MoebiusOptions = {}) {
    super("MoebiusEffect", fragmentShader, {
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map<string, THREE.Uniform>([
        ["uNormalBuffer", new THREE.Uniform(null)],
        ["uDebug", new THREE.Uniform(opts.debug ?? 0)],
        ["uCamNear", new THREE.Uniform(0.1)],
        ["uCamFar", new THREE.Uniform(100)],
        ["uTexel", new THREE.Uniform(new THREE.Vector2(1 / 1280, 1 / 720))],
        ["uOutlineThickness", new THREE.Uniform(opts.outlineThickness ?? 1.0)],
        ["uDepthScale", new THREE.Uniform(opts.depthScale ?? 25.0)],
        ["uNormalScale", new THREE.Uniform(opts.normalScale ?? 1.0)],
        ["uThreshold", new THREE.Uniform(opts.threshold ?? 1.2)],
      ]),
    });

    this.scene = scene;
    this.camera = camera;
    this.normalMaterial = new CustomNormalMaterial();
    if (opts.specThreshold !== undefined) this.normalMaterial.uniforms.uSpecThreshold.value = opts.specThreshold;
    if (opts.shininess !== undefined) this.normalMaterial.uniforms.uShininess.value = opts.shininess;
    this.normalRT = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      type: THREE.HalfFloatType,
    });
  }

  setSize(width: number, height: number) {
    this.normalRT.setSize(width, height);
    (this.uniforms.get("uTexel") as THREE.Uniform).value.set(1 / width, 1 / height);
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
    (this.uniforms.get("uCamFar") as THREE.Uniform).value = cam.far ?? 100;
  }

  set debug(v: number) { (this.uniforms.get("uDebug") as THREE.Uniform).value = v; }
  set specThreshold(v: number) { this.normalMaterial.uniforms.uSpecThreshold.value = v; }
  set shininess(v: number) { this.normalMaterial.uniforms.uShininess.value = v; }
  set outlineThickness(v: number) { (this.uniforms.get("uOutlineThickness") as THREE.Uniform).value = v; }
  set depthScale(v: number) { (this.uniforms.get("uDepthScale") as THREE.Uniform).value = v; }
  set normalScale(v: number) { (this.uniforms.get("uNormalScale") as THREE.Uniform).value = v; }
  set threshold(v: number) { (this.uniforms.get("uThreshold") as THREE.Uniform).value = v; }

  dispose() {
    this.normalRT.dispose();
    this.normalMaterial.dispose();
    super.dispose();
  }
}
