import { Effect } from "postprocessing";
import { Uniform, Color } from "three";

// Pipeline da assinatura (Secao 3 do brief de design), em um unico passe:
// 1. pixelizacao (amostra o buffer em celulas de pixelSize)
// 2. quantizacao para os tres tons (ink / paper / phosphor)
// 3. dither ordenado Bayer (temporalmente estavel, nao "ferve")
// 4. scanline/CRT opcional e discreto
// O alpha tambem e quantizado (1-bit), entao a cena segue transparente
// sobre a pagina, mas com borda dura de pixel.
const fragmentShader = /* glsl */ `
  uniform float pixelSize;
  uniform float ditherStrength;
  uniform float useBayer8;
  uniform vec3 inkColor;
  uniform vec3 paperColor;
  uniform vec3 phosphorColor;
  uniform float crt;

  // Matriz de Bayer por recursao (2x2 -> 4x4 -> 8x8)
  float bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2.0 + a.y * a.y * 0.75);
  }
  float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
  float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // 1. pixelizacao: uma amostra por celula
    vec2 cellOrigin = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
    vec2 cellCenter = (cellOrigin + pixelSize * 0.5) / resolution;
    vec4 src = texture2D(inputBuffer, cellCenter);

    // 2/3. limiar Bayer por celula (nao por fragmento: mantem o bloco solido)
    vec2 cellIndex = floor(gl_FragCoord.xy / pixelSize);
    float threshold = useBayer8 > 0.5 ? bayer8(cellIndex) : bayer4(cellIndex);

    float lum = dot(src.rgb, vec3(0.299, 0.587, 0.114));
    float dithered = lum + (threshold - 0.5) * ditherStrength;

    // Azul decide phosphor; o resto quantiza entre ink e paper
    bool bluish = src.b > (src.r + src.g) * 0.8 && src.b > 0.15;
    vec3 tone = bluish ? phosphorColor : (dithered < 0.5 ? inkColor : paperColor);

    // Alpha 1-bit com o mesmo limiar (borda dura de pixel)
    float alphaDithered = src.a + (threshold - 0.5) * ditherStrength;
    float alpha = alphaDithered < 0.5 ? 0.0 : 1.0;

    // 4. scanline discreta, desligavel
    float scan = 1.0 - crt * step(0.5, fract(gl_FragCoord.y / (pixelSize * 2.0))) * 0.22;

    outputColor = vec4(tone * scan, alpha);
  }
`;

export interface PhosphorDitherOptions {
  pixelSize?: number;
  ditherStrength?: number;
  useBayer8?: boolean;
  crt?: number;
  ink?: string;
  paper?: string;
  phosphor?: string;
}

export class PhosphorDitherEffect extends Effect {
  constructor({
    pixelSize = 3,
    ditherStrength = 0.34,
    useBayer8 = false,
    crt = 0,
    ink = "#0d0d0d",
    paper = "#fafafa",
    phosphor = "#0b2ca2",
  }: PhosphorDitherOptions = {}) {
    super("PhosphorDitherEffect", fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["pixelSize", new Uniform(pixelSize)],
        ["ditherStrength", new Uniform(ditherStrength)],
        ["useBayer8", new Uniform(useBayer8 ? 1 : 0)],
        ["crt", new Uniform(crt)],
        ["inkColor", new Uniform(new Color(ink))],
        ["paperColor", new Uniform(new Color(paper))],
        ["phosphorColor", new Uniform(new Color(phosphor))],
      ]),
    });
  }

  set(values: Required<Pick<PhosphorDitherOptions, "pixelSize" | "ditherStrength" | "crt">> & { useBayer8: boolean }) {
    this.uniforms.get("pixelSize")!.value = values.pixelSize;
    this.uniforms.get("ditherStrength")!.value = values.ditherStrength;
    this.uniforms.get("useBayer8")!.value = values.useBayer8 ? 1 : 0;
    this.uniforms.get("crt")!.value = values.crt;
  }
}
