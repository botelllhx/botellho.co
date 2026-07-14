// Gera as versoes dithered do Ban (Floyd-Steinberg, so em assets estaticos,
// conforme o design brief) a partir das fotos em public/assets.
// Estencil de fosforo sobre transparente: funciona em secao ink e paper.
// Uso: npm i -D sharp && node scripts/gen-ban-assets.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";

const PHOSPHOR = [11, 44, 162]; // #0b2ca2
const SRC = "public/ban";
const OUT = "public/ban";
const WIDTH = 480; // resolucao do dither; o display sobe com pixelated

mkdirSync(OUT, { recursive: true });

const ditherOne = async (input, output) => {
  const { data, info } = await sharp(input)
    .resize(WIDTH, WIDTH, { fit: "cover", position: "top" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  // cobertura de tinta por pixel: escuro -> alta cobertura
  const cover = new Float32Array(width * height);
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // realce de contraste: fundo branco some, sujeito acende
    cover[i] = Math.min(1, Math.max(0, (1 - lum) * 1.35 - 0.06));
  }

  // Floyd-Steinberg sobre a cobertura, 1-bit
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      const old = cover[i];
      const fired = old > 0.5 ? 1 : 0;
      const err = old - fired;
      // difusao do erro
      if (x + 1 < width) cover[i + 1] += err * 7 / 16;
      if (y + 1 < height) {
        if (x > 0) cover[i + width - 1] += err * 3 / 16;
        cover[i + width] += err * 5 / 16;
        if (x + 1 < width) cover[i + width + 1] += err * 1 / 16;
      }
      const o = i * 4;
      if (fired) {
        out[o] = PHOSPHOR[0];
        out[o + 1] = PHOSPHOR[1];
        out[o + 2] = PHOSPHOR[2];
        out[o + 3] = 255;
      } else {
        out[o + 3] = 0;
      }
    }
  }

  await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(output);
  return output;
};

for (let n = 1; n <= 5; n += 1) {
  const out = await ditherOne(`${SRC}/ban ${n}.png`, `${OUT}/ban-${n}.png`);
  console.log("gerado", out);
}
