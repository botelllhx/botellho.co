import * as THREE from "three";
import { Effect } from "postprocessing";

// Passe CRT (Etapa 6) — ULTIMO da cadeia: monitor velho mostrando o bitmap.
// Roda depois do retro (mesmo passe, mas o mainImage dele vem antes do nosso),
// e sempre depois do Moebius (que tem passe proprio por ser CONVOLUTION).
// Ordem final: buffers -> Moebius (full-res) -> retro -> CRT.
const fragmentShader = /* glsl */ `
  uniform vec2 uResolution;
  uniform float uCurvature;
  uniform float uScanline;
  uniform float uScanScale;
  uniform float uVignette;
  uniform float uBrightness;
  uniform vec3 uInk;

  // curvatura barril: empurra o UV de amostragem pras bordas (tubo)
  void mainUv(inout vec2 uv) {
    vec2 c = uv * 2.0 - 1.0;
    float r2 = dot(c, c);
    c *= 1.0 + uCurvature * r2;
    uv = c * 0.5 + 0.5;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 col = inputColor.rgb;

    // scanlines em espaco de TELA (nao acompanham a curvatura, como num tubo real)
    float s = sin(gl_FragCoord.y * uScanScale);
    col *= 1.0 - uScanline * (0.5 + 0.5 * s);

    // vinheta suave nos cantos
    vec2 d = uv - 0.5;
    col *= 1.0 - uVignette * dot(d, d) * 2.0;

    col *= uBrightness;

    // fora do tubo (a curvatura jogou o UV pra fora) -> ink
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) col = uInk;

    outputColor = vec4(col, inputColor.a);
  }
`;

export interface CrtOptions {
  curvature?: number;
  scanline?: number;
  scanScale?: number;
  vignette?: number;
  brightness?: number;
}

export class CrtEffect extends Effect {
  constructor(opts: CrtOptions = {}) {
    super("CrtEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uResolution", new THREE.Uniform(new THREE.Vector2(1280, 720))],
        ["uCurvature", new THREE.Uniform(opts.curvature ?? 0.06)],
        ["uScanline", new THREE.Uniform(opts.scanline ?? 0.12)],
        ["uScanScale", new THREE.Uniform(opts.scanScale ?? 1.6)],
        ["uVignette", new THREE.Uniform(opts.vignette ?? 0.35)],
        ["uBrightness", new THREE.Uniform(opts.brightness ?? 1.05)],
        ["uInk", new THREE.Uniform(new THREE.Color("hsl(0, 0%, 5%)"))],
      ]),
    });
  }

  setSize(width: number, height: number) {
    (this.uniforms.get("uResolution") as THREE.Uniform).value.set(width, height);
  }

  set curvature(v: number) { (this.uniforms.get("uCurvature") as THREE.Uniform).value = v; }
  set scanline(v: number) { (this.uniforms.get("uScanline") as THREE.Uniform).value = v; }
  set scanScale(v: number) { (this.uniforms.get("uScanScale") as THREE.Uniform).value = v; }
  set vignette(v: number) { (this.uniforms.get("uVignette") as THREE.Uniform).value = v; }
  set brightness(v: number) { (this.uniforms.get("uBrightness") as THREE.Uniform).value = v; }
}
