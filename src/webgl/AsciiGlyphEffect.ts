import { Effect } from "postprocessing";
import { Uniform, Color, Texture, Vector2 } from "three";

// ASCII complexo (Secao 3.4): amostra o framebuffer em celulas, calcula a
// densidade media (3x3 taps, para nao perder linhas finas de wireframe) e
// mapeia para um glifo do atlas IBM VGA na rampa por densidade de tinta.
const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float glyphCount;
  uniform vec2 cellPx;
  uniform float gain;
  uniform vec3 phosphorColor;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cellIndex = floor(gl_FragCoord.xy / cellPx);

    // Media 3x3 dentro da celula (wireframe fino escapa de 1 tap central)
    vec3 acc = vec3(0.0);
    float accAlpha = 0.0;
    for (int dx = 0; dx < 3; dx += 1) {
      for (int dy = 0; dy < 3; dy += 1) {
        vec2 offset = (vec2(float(dx), float(dy)) + 0.5) / 3.0;
        vec2 tapUv = (cellIndex * cellPx + cellPx * offset) / resolution;
        vec4 tap = texture2D(inputBuffer, tapUv);
        acc += tap.rgb;
        accAlpha += tap.a;
      }
    }
    acc /= 9.0;
    accAlpha /= 9.0;

    // Canal maximo como driver (o azul phosphor tem luminancia baixa)
    float intensity = max(max(acc.r, acc.g), acc.b);
    float density = clamp(intensity * accAlpha * gain, 0.0, 1.0);
    float glyphIndex = floor(density * (glyphCount - 1.0) + 0.5);

    // Recorta o glifo no atlas (linha unica, v invertido: canvas e top-down)
    vec2 intra = fract(gl_FragCoord.xy / cellPx);
    vec2 atlasUv = vec2((glyphIndex + intra.x) / glyphCount, 1.0 - intra.y);
    float mask = step(0.5, texture2D(uAtlas, atlasUv).a);

    outputColor = vec4(phosphorColor * mask, mask);
  }
`;

export interface AsciiGlyphOptions {
  atlas: Texture;
  glyphCount: number;
  cellWidth?: number;
  cellHeight?: number;
  gain?: number;
  phosphor?: string;
}

export class AsciiGlyphEffect extends Effect {
  constructor({
    atlas,
    glyphCount,
    cellWidth = 8,
    cellHeight = 16,
    gain = 1.6,
    phosphor = "#0b2ca2",
  }: AsciiGlyphOptions) {
    super("AsciiGlyphEffect", fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["uAtlas", new Uniform(atlas)],
        ["glyphCount", new Uniform(glyphCount)],
        ["cellPx", new Uniform(new Vector2(cellWidth, cellHeight))],
        ["gain", new Uniform(gain)],
        ["phosphorColor", new Uniform(new Color(phosphor))],
      ]),
    });
  }
}
