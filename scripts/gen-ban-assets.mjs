// Gera o Ban em BITMAP 1-bit preto e branco (brand guide + editor BDFM:
// metodo BITMAP, controlado por SIZE e THRESHOLD, nao dither). Threshold
// puro: pixeliza num grid grosso e cada bloco vira tinta ou vazio pela
// luminancia. Sem difusao de erro (sem speckle). Saida ink-on-transparent.
// Uso: npm i -D sharp && node scripts/gen-ban-assets.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";

const INK = [17, 17, 17];
const OUT = "public/ban";
const PORTRAITS = "assets/ban-source";

// SIZE = lado do grid em blocos (maior = mais detalhe / menos chunky).
// THRESHOLD = corte de luminancia 0..1 (igual ao BDFM: bloco mais ESCURO que
// o corte vira tinta; baixar o threshold = menos preto = mais detalhe).
const SIZE = 150;
const THRESHOLD = 0.45;
const CONTRAST = 1.15;

mkdirSync(OUT, { recursive: true });

const bitmap = async (input, output, gridW, gridH) => {
  // media por bloco (downscale), sem dither
  const { data, info } = await sharp(input)
    .resize(gridW, gridH, { fit: "cover", position: "top" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const out = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i += 1) {
    const raw = (0.299 * data[i * 3] + 0.587 * data[i * 3 + 1] + 0.114 * data[i * 3 + 2]) / 255;
    // contraste em torno do meio
    const lum = Math.min(1, Math.max(0, (raw - 0.5) * CONTRAST + 0.5));
    const o = i * 4;
    if (lum < THRESHOLD) {
      out[o] = INK[0]; out[o + 1] = INK[1]; out[o + 2] = INK[2]; out[o + 3] = 255;
    } else {
      out[o + 3] = 0;
    }
  }
  // exporta no tamanho do grid; no site sobe com image-rendering: pixelated
  await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(output);
  return output;
};

for (let n = 1; n <= 5; n += 1) {
  console.log("gerado", await bitmap(`${PORTRAITS}/ban ${n}.png`, `${OUT}/ban-${n}.png`, SIZE, SIZE));
}
console.log("gerado", await bitmap(`${OUT}/ban.jpg`, `${OUT}/ban-mark.png`, Math.round(SIZE * 1.7), SIZE));
