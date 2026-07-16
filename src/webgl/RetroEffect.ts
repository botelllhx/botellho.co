import * as THREE from "three";
import { Effect } from "postprocessing";

// Passe retro/bitmap — roda DEPOIS do Moebius, num passe SEPARADO (o Moebius e
// marcado como CONVOLUTION, entao a lib nao funde os dois). Assim a pixelizacao
// (mainUv) daqui so afeta o resultado ja-pronto do Moebius, nunca a amostragem
// dele. Ordem: buffers -> Moebius (full-res) -> AQUI (pixelize -> Bayer -> paleta).
// Paleta 1-bit do site: ink / phosphor(azul) / paper(branco).
const fragmentShader = /* glsl */ `
  uniform vec2 uResolution;
  uniform float uPixelSize;
  uniform float uDither;
  uniform float uMix;
  uniform vec3 uInk;
  uniform vec3 uBlue;
  uniform vec3 uPaper;
  uniform float uLoBand;
  uniform float uHiBand;

  float luma(vec3 c) { return dot(c, vec3(0.2125, 0.7154, 0.0721)); }

  // Bayer 4x4 ordenado (16 niveis em [0,1)) — snippet classico recursivo.
  float bayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
  float bayer4(vec2 a) { return bayer2(a * 0.5) * 0.25 + bayer2(a); }

  // pixelizacao: trava o UV de amostragem numa grade de uPixelSize px.
  void mainUv(inout vec2 uv) {
    vec2 grid = uResolution / max(uPixelSize, 1.0);
    uv = (floor(uv * grid) + 0.5) / grid;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float L = luma(inputColor.rgb);
    // dither por BLOCO (mesma matriz Bayer dentro de cada bloco pixelizado)
    vec2 block = floor(gl_FragCoord.xy / max(uPixelSize, 1.0));
    float d = (bayer4(block) - 0.5) * uDither;
    float t = clamp(L + d, 0.0, 1.0);
    vec3 pal = t < uLoBand ? uInk : (t < uHiBand ? uBlue : uPaper);
    outputColor = vec4(mix(inputColor.rgb, pal, uMix), inputColor.a);
  }
`;

export interface RetroOptions {
  pixelSize?: number;
  dither?: number;
  mix?: number;
  loBand?: number;
  hiBand?: number;
}

export class RetroEffect extends Effect {
  constructor(opts: RetroOptions = {}) {
    super("RetroEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uResolution", new THREE.Uniform(new THREE.Vector2(1280, 720))],
        // valores calibrados e travados pelo Mateus
        ["uPixelSize", new THREE.Uniform(opts.pixelSize ?? 2)],
        ["uDither", new THREE.Uniform(opts.dither ?? 0.09)],
        ["uMix", new THREE.Uniform(opts.mix ?? 1)],
        ["uLoBand", new THREE.Uniform(opts.loBand ?? 0.05)],
        ["uHiBand", new THREE.Uniform(opts.hiBand ?? 0.55)],
        ["uInk", new THREE.Uniform(new THREE.Color("hsl(0, 0%, 5%)"))],
        ["uBlue", new THREE.Uniform(new THREE.Color("hsl(227, 87%, 34%)"))],
        ["uPaper", new THREE.Uniform(new THREE.Color("hsl(0, 0%, 100%)"))],
      ]),
    });
  }

  setSize(width: number, height: number) {
    (this.uniforms.get("uResolution") as THREE.Uniform).value.set(width, height);
  }

  set pixelSize(v: number) { (this.uniforms.get("uPixelSize") as THREE.Uniform).value = v; }
  set dither(v: number) { (this.uniforms.get("uDither") as THREE.Uniform).value = v; }
  set mix(v: number) { (this.uniforms.get("uMix") as THREE.Uniform).value = v; }
  set loBand(v: number) { (this.uniforms.get("uLoBand") as THREE.Uniform).value = v; }
  set hiBand(v: number) { (this.uniforms.get("uHiBand") as THREE.Uniform).value = v; }
}
