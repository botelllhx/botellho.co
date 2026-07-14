import * as THREE from "three";
import { Effect, EffectAttribute } from "postprocessing";
import { CustomNormalMaterial } from "./CustomNormalMaterial";

// Efeito Moebius (full-res, ANTES de pixelizar/ditherizar).
// Etapa 3 (buffers): renderiza o passe de NORMAIS num render target proprio e
// recebe a PROFUNDIDADE do composer. Modo debug pra visualizar/aprovar os
// buffers (0 = cena, 1 = normais, 2 = profundidade). O Sobel entra na Etapa 4.
const fragmentShader = /* glsl */ `
  uniform sampler2D uNormalBuffer;
  uniform float uDebug;
  uniform float uCamNear;
  uniform float uCamFar;

  float linearizeDepth(float d) {
    float z = d * 2.0 - 1.0;
    return (2.0 * uCamNear * uCamFar) / (uCamFar + uCamNear - z * (uCamFar - uCamNear));
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    if (uDebug > 1.5) {
      float ld = clamp(linearizeDepth(depth) / uCamFar, 0.0, 1.0);
      outputColor = vec4(vec3(1.0 - ld), 1.0);
      return;
    }
    if (uDebug > 0.5) {
      outputColor = vec4(texture2D(uNormalBuffer, uv).rgb, 1.0);
      return;
    }
    outputColor = inputColor;
  }
`;

export interface MoebiusOptions {
  debug?: number;
  specThreshold?: number;
  shininess?: number;
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
        ["uDebug", new THREE.Uniform(opts.debug ?? 1)],
        ["uCamNear", new THREE.Uniform(0.1)],
        ["uCamFar", new THREE.Uniform(100)],
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

  set debug(v: number) {
    (this.uniforms.get("uDebug") as THREE.Uniform).value = v;
  }
  set specThreshold(v: number) {
    this.normalMaterial.uniforms.uSpecThreshold.value = v;
  }
  set shininess(v: number) {
    this.normalMaterial.uniforms.uShininess.value = v;
  }

  dispose() {
    this.normalRT.dispose();
    this.normalMaterial.dispose();
    super.dispose();
  }
}
