// Gera o retrato da Leticia em dither 1-bit (Floyd-Steinberg) no nosso azul, pra
// pagina-dedicatoria (o easter egg). Branco (paper) onde tem luz, azul (phosphor)
// onde tem sombra: o azul do dither e o mesmo do card, entao ela emerge do campo.
// Uso: npm i -D sharp && node scripts/gen-leticia.mjs
// (sharp so pra gerar; nao e dependencia de runtime, igual gen-ban e gen-favicon.)
import sharp from "sharp";
import { mkdirSync } from "fs";

const AZUL = [11, 44, 162]; // --phosphor
const PAPER = [246, 247, 251];
const FONTE = "assets/leticia.jpeg";
const OUT = "public/leticia";

// Enquadra no rosto: corta a janela do topo e a parede da esquerda.
const CROP = { x0: 0.34, y0: 0.05, x1: 0.99, y1: 0.86 };
const LARGURA = 224; // resolucao do grid; sobe com image-rendering: pixelated
const CONTRASTE = 1.08;
const BRILHO = 1.4; // claro de proposito: o rosto dela tem que saltar do azul

mkdirSync(OUT, { recursive: true });

// Estica o histograma cortando 2% de cada ponta (equivale ao autocontrast do PIL).
const autocontraste = (lum, n, corte = 0.02) => {
  const hist = new Array(256).fill(0);
  for (let i = 0; i < n; i += 1) hist[lum[i]] += 1;
  const alvo = Math.floor(n * corte);
  let baixo = 0, acc = 0;
  for (; baixo < 256; baixo += 1) { acc += hist[baixo]; if (acc > alvo) break; }
  let alto = 255; acc = 0;
  for (; alto > 0; alto -= 1) { acc += hist[alto]; if (acc > alvo) break; }
  if (alto <= baixo) return;
  const faixa = alto - baixo;
  for (let i = 0; i < n; i += 1) {
    lum[i] = Math.max(0, Math.min(255, Math.round(((lum[i] - baixo) / faixa) * 255)));
  }
};

const gerar = async () => {
  const meta = await sharp(FONTE).metadata();
  const esq = Math.round(meta.width * CROP.x0);
  const topo = Math.round(meta.height * CROP.y0);
  const larguraCrop = Math.round(meta.width * (CROP.x1 - CROP.x0));
  const alturaCrop = Math.round(meta.height * (CROP.y1 - CROP.y0));
  const alt = Math.round((LARGURA * alturaCrop) / larguraCrop);

  const { data } = await sharp(FONTE)
    .extract({ left: esq, top: topo, width: larguraCrop, height: alturaCrop })
    .resize(LARGURA, alt, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const n = LARGURA * alt;
  const lum = new Float32Array(n);
  for (let i = 0; i < n; i += 1) lum[i] = data[i]; // grayscale = 1 canal

  const inteiro = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) inteiro[i] = lum[i];
  autocontraste(inteiro, n);

  // contraste em torno do meio, brilho, e o fade radial (ela emerge do centro)
  const cx = LARGURA * 0.5, cy = alt * 0.42;
  const rmax = Math.hypot(LARGURA * 0.6, alt * 0.6);
  for (let y = 0; y < alt; y += 1) {
    for (let x = 0; x < LARGURA; x += 1) {
      const i = y * LARGURA + x;
      let v = inteiro[i];
      v = (v - 128) * CONTRASTE + 128;
      v = v * BRILHO;
      const d = Math.hypot(x - cx, y - cy) / rmax;
      const k = Math.max(0, 1 - Math.max(0, d - 0.6) / 0.4);
      // fade suave: escurece a borda pra ela emergir, mas nunca apaga (piso 0.35)
      lum[i] = Math.max(0, Math.min(255, v * (0.35 + 0.65 * k)));
    }
  }

  // Floyd-Steinberg: difunde o erro do corte pros vizinhos (o granulado macio).
  const buf = Buffer.alloc(n * 4);
  for (let y = 0; y < alt; y += 1) {
    for (let x = 0; x < LARGURA; x += 1) {
      const i = y * LARGURA + x;
      const antigo = lum[i];
      const novo = antigo < 128 ? 0 : 255;
      const erro = antigo - novo;
      const cor = novo === 255 ? PAPER : AZUL;
      buf.set([...cor, 255], i * 4);
      if (x + 1 < LARGURA) lum[i + 1] += (erro * 7) / 16;
      if (y + 1 < alt) {
        if (x > 0) lum[i + LARGURA - 1] += (erro * 3) / 16;
        lum[i + LARGURA] += (erro * 5) / 16;
        if (x + 1 < LARGURA) lum[i + LARGURA + 1] += (erro * 1) / 16;
      }
    }
  }

  await sharp(buf, { raw: { width: LARGURA, height: alt, channels: 4 } })
    .png()
    .toFile(`${OUT}/leticia.png`);
  console.log(`Gerado: ${OUT}/leticia.png (${LARGURA}x${alt})`);
};

await gerar();
