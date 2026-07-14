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

  float lind(float d) {
    float z = d * 2.0 - 1.0;
    return (2.0 * uCamNear * uCamFar) / (uCamFar + uCamNear - z * (uCamFar - uCamNear));
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    // ---- debug ----
    if (uDebug > 1.5) {
      float dv = clamp((lind(depth) - uCamNear) / 8.0, 0.0, 1.0);
      outputColor = vec4(vec3(1.0 - dv), 1.0);
      return;
    }
    if (uDebug > 0.5) {
      outputColor = vec4(texture2D(uNormalBuffer, uv).rgb, 1.0);
      return;
    }

    // ---- Sobel 3x3 ----
    vec2 o = uTexel * uOutlineThickness;
    float d0 = lind(texture2D(depthBuffer, uv + o * vec2(-1.0, -1.0)).r);
    float d1 = lind(texture2D(depthBuffer, uv + o * vec2( 0.0, -1.0)).r);
    float d2 = lind(texture2D(depthBuffer, uv + o * vec2( 1.0, -1.0)).r);
    float d3 = lind(texture2D(depthBuffer, uv + o * vec2(-1.0,  0.0)).r);
    float d5 = lind(texture2D(depthBuffer, uv + o * vec2( 1.0,  0.0)).r);
    float d6 = lind(texture2D(depthBuffer, uv + o * vec2(-1.0,  1.0)).r);
    float d7 = lind(texture2D(depthBuffer, uv + o * vec2( 0.0,  1.0)).r);
    float d8 = lind(texture2D(depthBuffer, uv + o * vec2( 1.0,  1.0)).r);
    float gdx = (d2 + 2.0 * d5 + d8) - (d0 + 2.0 * d3 + d6);
    float gdy = (d6 + 2.0 * d7 + d8) - (d0 + 2.0 * d1 + d2);
    float edgeDepth = length(vec2(gdx, gdy));

    vec3 n0 = texture2D(uNormalBuffer, uv + o * vec2(-1.0, -1.0)).rgb;
    vec3 n1 = texture2D(uNormalBuffer, uv + o * vec2( 0.0, -1.0)).rgb;
    vec3 n2 = texture2D(uNormalBuffer, uv + o * vec2( 1.0, -1.0)).rgb;
    vec3 n3 = texture2D(uNormalBuffer, uv + o * vec2(-1.0,  0.0)).rgb;
    vec3 n5 = texture2D(uNormalBuffer, uv + o * vec2( 1.0,  0.0)).rgb;
    vec3 n6 = texture2D(uNormalBuffer, uv + o * vec2(-1.0,  1.0)).rgb;
    vec3 n7 = texture2D(uNormalBuffer, uv + o * vec2( 0.0,  1.0)).rgb;
    vec3 n8 = texture2D(uNormalBuffer, uv + o * vec2( 1.0,  1.0)).rgb;
    vec3 gnx = (n2 + 2.0 * n5 + n8) - (n0 + 2.0 * n3 + n6);
    vec3 gny = (n6 + 2.0 * n7 + n8) - (n0 + 2.0 * n1 + n2);
    float edgeNormal = length(gnx) + length(gny);

    float outline = clamp(edgeDepth * uDepthScale + edgeNormal * uNormalScale, 0.0, 1.0);
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

  dispose() {
    this.normalRT.dispose();
    this.normalMaterial.dispose();
    super.dispose();
  }
}
