import { Effect } from "postprocessing";
import { Uniform, Color, DataTexture, RGBAFormat, NearestFilter } from "three";

// A assinatura (Secao 3 do brief + tecnicas de dithering/retro shading em
// R3F do Maxime Heckel), em um passe custom:
// 1. curvatura CRT leve (desligavel)
// 2. pixelizacao por snap de UV a uma grade (uniform pixelSize)
// 3. aberracao cromatica discreta, pre-quantizacao
// 4. dither ordenado por matriz de Bayer (4x4 default, 8x8 opcional)
// 5. quantizacao floor(v*(n-1)+0.5)/(n-1) + sample da textura de paleta
//    (ink / phosphor / paper, ordenadas por luminancia)
// 6. scanline e mascara de colunas discretas
// O alpha e quantizado (1-bit): a cena segue transparente sobre a pagina.
const fragmentShader = /* glsl */ `
  uniform sampler2D uPalette;
  uniform float uPixelSize;
  uniform float uColorCount;
  uniform float uBayer8;
  uniform float uDither;
  uniform float uDitherStrength;
  uniform float uCrt;

  float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
  float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
  float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

  vec2 curve(vec2 uv, float k) {
    vec2 c = uv * 2.0 - 1.0;
    c *= 1.0 + k * dot(c, c) * 0.07;
    return c * 0.5 + 0.5;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // 1. curvatura
    vec2 cuv = uCrt > 0.0 ? curve(uv, uCrt) : uv;

    // 2. pixelizacao: snap do UV a grade
    vec2 grid = resolution / uPixelSize;
    vec2 puv = (floor(cuv * grid) + 0.5) / grid;

    // 3. aberracao cromatica discreta
    float ca = uCrt * 0.0016;
    vec4 base = texture2D(inputBuffer, puv);
    float r = texture2D(inputBuffer, puv + vec2(ca, 0.0)).r;
    float b = texture2D(inputBuffer, puv - vec2(ca, 0.0)).b;
    vec3 col = vec3(r, base.g, b);

    // 4. dither ordenado (canal maximo como driver: o phosphor tem
    //    luminancia baixa e sumiria no criterio classico)
    float driver = max(max(col.r, col.g), col.b);
    vec2 cell = floor(gl_FragCoord.xy / uPixelSize);
    float threshold = uBayer8 > 0.5 ? bayer8(cell) : bayer4(cell);
    // Bitmap fixo: pixel-6 quantizado em bloco. O dither (ruido ordenado)
    // so entra quando uDither = 1 (imagens estaticas pontuais).
    float dithered = driver + (uDither > 0.5 ? (threshold - 0.5) * uDitherStrength : 0.0);

    // 5. quantizacao + paleta
    float q = clamp(floor(dithered * (uColorCount - 1.0) + 0.5) / (uColorCount - 1.0), 0.0, 1.0);
    vec3 tone = texture2D(uPalette, vec2(q, 0.5)).rgb;

    // alpha 1-bit com o mesmo limiar
    float a = base.a + (threshold - 0.5) * uDitherStrength;
    float alpha = a < 0.5 ? 0.0 : 1.0;

    // 6. scanline + mascara de colunas
    float scan = 1.0 - uCrt * 0.16 * step(0.5, fract(gl_FragCoord.y / (uPixelSize * 2.0)));
    float mask = 1.0 - uCrt * 0.07 * step(0.66, fract(gl_FragCoord.x / (uPixelSize * 3.0)));

    outputColor = vec4(tone * scan * mask, alpha);
  }
`;

const hslToColor = (h: string) => new Color(h);

// Paleta 1xN em textura, ordenada por luminancia: ink -> phosphor -> paper
const buildPaletteTexture = (ink: string, phosphor: string, paper: string) => {
  const tones = [hslToColor(ink), hslToColor(phosphor), hslToColor(paper)];
  const data = new Uint8Array(tones.length * 4);
  tones.forEach((tone, i) => {
    data[i * 4] = Math.round(tone.r * 255);
    data[i * 4 + 1] = Math.round(tone.g * 255);
    data[i * 4 + 2] = Math.round(tone.b * 255);
    data[i * 4 + 3] = 255;
  });
  const texture = new DataTexture(data, tones.length, 1, RGBAFormat);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.needsUpdate = true;
  return texture;
};

export interface PhosphorEffectOptions {
  pixelSize?: number;
  useDither?: boolean;
  ditherStrength?: number;
  useBayer8?: boolean;
  crt?: number;
}

export class PhosphorEffect extends Effect {
  constructor({
    pixelSize = 6,
    useDither = false,
    ditherStrength = 0.34,
    useBayer8 = false,
    crt = 0.3,
  }: PhosphorEffectOptions = {}) {
    super("PhosphorEffect", fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["uPalette", new Uniform(buildPaletteTexture("#0d0d0d", "#0b2ca2", "#fafafa"))],
        ["uPixelSize", new Uniform(pixelSize)],
        ["uColorCount", new Uniform(3)],
        ["uBayer8", new Uniform(useBayer8 ? 1 : 0)],
        ["uDither", new Uniform(useDither ? 1 : 0)],
        ["uDitherStrength", new Uniform(ditherStrength)],
        ["uCrt", new Uniform(crt)],
      ]),
    });
  }

  set(values: Required<Omit<PhosphorEffectOptions, "useDither">> & { useDither?: boolean }) {
    this.uniforms.get("uPixelSize")!.value = values.pixelSize;
    this.uniforms.get("uDither")!.value = values.useDither ? 1 : 0;
    this.uniforms.get("uDitherStrength")!.value = values.ditherStrength;
    this.uniforms.get("uBayer8")!.value = values.useBayer8 ? 1 : 0;
    this.uniforms.get("uCrt")!.value = values.crt;
  }
}
