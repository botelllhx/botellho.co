import { CanvasTexture, NearestFilter } from "three";

// Atlas de glifos da fonte bitmap IBM VGA (int10h) para o efeito ASCII
// complexo (Secao 3.4 do brief): rampa longa ordenada por densidade de
// tinta medida de verdade (dezenas de niveis, nao 5 caracteres).

export interface GlyphAtlas {
  texture: CanvasTexture;
  glyphCount: number;
}

// Candidatos: ASCII imprimivel + blocos CP437. A ordem final vem da medicao.
const CANDIDATES =
  " .'`^\",:;!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$░▒▓█";

const CELL_W = 8;
const CELL_H = 16;
const FONT = `${CELL_H}px "IBM VGA"`;

const measureDensity = (glyph: string, ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, CELL_W, CELL_H);
  ctx.fillText(glyph, 0, 0);
  const data = ctx.getImageData(0, 0, CELL_W, CELL_H).data;
  let ink = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 127) ink += 1;
  }
  return ink / (CELL_W * CELL_H);
};

export const buildGlyphAtlas = async (maxGlyphs = 48): Promise<GlyphAtlas> => {
  await document.fonts.load(FONT, CANDIDATES);

  const measure = document.createElement("canvas");
  measure.width = CELL_W;
  measure.height = CELL_H;
  const mctx = measure.getContext("2d", { willReadFrequently: true })!;
  mctx.font = FONT;
  mctx.textBaseline = "top";
  mctx.fillStyle = "#fff";

  // Mede a cobertura de tinta de cada glifo e ordena do vazio ao cheio
  const measured = [...CANDIDATES]
    .map((glyph) => ({ glyph, density: measureDensity(glyph, mctx) }))
    .sort((a, b) => a.density - b.density);

  // Dedup por densidade quase igual, mantendo a rampa longa e monotonica
  const ramp: typeof measured = [];
  for (const item of measured) {
    const last = ramp[ramp.length - 1];
    if (!last || item.density - last.density >= 0.012) {
      ramp.push(item);
    }
  }
  const glyphs = ramp.slice(0, maxGlyphs);

  const atlas = document.createElement("canvas");
  atlas.width = glyphs.length * CELL_W;
  atlas.height = CELL_H;
  const actx = atlas.getContext("2d")!;
  actx.font = FONT;
  actx.textBaseline = "top";
  actx.fillStyle = "#fff";
  glyphs.forEach((item, index) => {
    actx.fillText(item.glyph, index * CELL_W, 0);
  });

  const texture = new CanvasTexture(atlas);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;

  return { texture, glyphCount: glyphs.length };
};
