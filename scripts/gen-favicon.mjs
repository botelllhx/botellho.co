// Gera a familia de icones a partir do Ban da logo (public/ban/ban-mark.png).
// Uso: npm i -D sharp && node scripts/gen-favicon.mjs
// (sharp e usado apenas para gerar estes arquivos; nao e dependencia de runtime.)
//
// Em TODO tamanho a arte e a logo. A reducao e por media de cobertura por bloco
// (area), que preserva a massa da forma.
//
// De 32 pra cima o corte 1-bit sai limpo, entao ele e aplicado: fica nitido e no
// mesmo idioma do gen-ban-assets (threshold, sem dither).
//
// No 16 o corte NAO e aplicado, e isso e deliberado. Nesse tamanho a pata do Ban
// tem 1 pixel de largura e o vao entre elas tambem: qualquer limiar (testei de
// 0.20 a 0.35, fixo e adaptativo por faixa) ou come a pata ou deixa a silhueta
// esburacada. Ja tentei tambem desenhar um Ban proprio pro 16, e o resultado era
// nitido mas nao era o Ban: corpo alto demais, lia como cachorro generico. A
// 16px ninguem percebe anti-alias, percebe se e o cachorro certo. Entao aqui a
// fidelidade a marca ganha da pureza 1-bit, e o 16 fica suave.
import sharp from "sharp";
import { writeFileSync } from "fs";

const AZUL = [11, 44, 162]; // --phosphor (227 87% 34%), o mesmo PRIMARY do og
const PAPER = [255, 255, 255];
const FONTE = "public/ban/ban-mark.png";
const CORTE = 0.4; // mesmo espirito do THRESHOLD do gen-ban-assets

// Silhueta da logo em alpha, ja recortada na caixa util.
const carregarSilhueta = async () => {
  const { data, info } = await sharp(FONTE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = (x, y) => data[(y * info.width + x) * 4 + 3];
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (alpha(x, y) > 128) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { alpha, x0, y0, larg: x1 - x0 + 1, alt: y1 - y0 + 1 };
};

// Reduz a silhueta pra uma grade de `cols`, devolvendo a COBERTURA de cada bloco
// (0..1). Media por area, e nao amostragem, entao a massa da forma se preserva.
const coberturaDaLogo = (sil, cols) => {
  const linhas = Math.max(1, Math.round((cols * sil.alt) / sil.larg));
  const grade = [];
  for (let gy = 0; gy < linhas; gy += 1) {
    const linha = [];
    for (let gx = 0; gx < cols; gx += 1) {
      const ax = sil.x0 + (gx * sil.larg) / cols;
      const bx = sil.x0 + ((gx + 1) * sil.larg) / cols;
      const ay = sil.y0 + (gy * sil.alt) / linhas;
      const by = sil.y0 + ((gy + 1) * sil.alt) / linhas;
      let soma = 0, n = 0;
      for (let y = Math.floor(ay); y < Math.ceil(by); y += 1) {
        for (let x = Math.floor(ax); x < Math.ceil(bx); x += 1) {
          soma += sil.alpha(x, y);
          n += 1;
        }
      }
      linha.push(n ? soma / n / 255 : 0);
    }
    grade.push(linha);
  }
  return grade;
};

/** Corta a cobertura em 1-bit: usado de 32 pra cima, onde a forma aguenta. */
const cortar = (grade) => grade.map((linha) => linha.map((v) => (v > CORTE ? 1 : 0)));

// Pinta a grade centrada num quadro, em fator INTEIRO (sem resize depois). A
// cobertura vira a mistura entre o azul e o branco: nas grades ja cortadas ela e
// 0 ou 1, entao sai chapado; no 16 ela e continua, e sai suave. Mesmo caminho
// pros dois casos.
const pintar = (grade, cols, escala, margem = 0) => {
  const lado = cols * escala + margem * 2;
  const buf = Buffer.alloc(lado * lado * 4);
  for (let i = 0; i < lado * lado; i += 1) buf.set([...AZUL, 255], i * 4);
  const topo = Math.floor((cols - grade.length) / 2);
  grade.forEach((linha, gy) => {
    linha.forEach((v, gx) => {
      if (v <= 0) return;
      const cor = AZUL.map((c, i) => Math.round(c + (PAPER[i] - c) * v));
      for (let y = 0; y < escala; y += 1) {
        for (let x = 0; x < escala; x += 1) {
          const px = margem + gx * escala + x;
          const py = margem + (topo + gy) * escala + y;
          buf.set([...cor, 255], (py * lado + px) * 4);
        }
      }
    });
  });
  return sharp(buf, { raw: { width: lado, height: lado, channels: 4 } }).png();
};

// Container .ico na mao: cabecalho + uma entrada por tamanho + os PNGs colados.
// Cada tamanho vai NATIVO, com a arte propria dele, e o navegador escolhe sem
// redimensionar nada.
const montarIco = (imagens) => {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2); // tipo 1 = icone
  cabecalho.writeUInt16LE(imagens.length, 4);
  const entradas = Buffer.alloc(16 * imagens.length);
  let deslocamento = 6 + 16 * imagens.length;
  imagens.forEach(({ lado, png }, i) => {
    const e = 16 * i;
    entradas.writeUInt8(lado >= 256 ? 0 : lado, e + 0);
    entradas.writeUInt8(lado >= 256 ? 0 : lado, e + 1);
    entradas.writeUInt8(0, e + 2); // sem paleta
    entradas.writeUInt8(0, e + 3); // reservado
    entradas.writeUInt16LE(1, e + 4); // planos
    entradas.writeUInt16LE(32, e + 6); // bits por pixel
    entradas.writeUInt32LE(png.length, e + 8);
    entradas.writeUInt32LE(deslocamento, e + 12);
    deslocamento += png.length;
  });
  return Buffer.concat([cabecalho, entradas, ...imagens.map((i) => i.png)]);
};

const sil = await carregarSilhueta();

const ico = [
  // 16 fica suave de proposito (ver comentario do topo): la o corte quebra a pata
  { lado: 16, png: await pintar(coberturaDaLogo(sil, 16), 16, 1).toBuffer() },
  { lado: 32, png: await pintar(cortar(coberturaDaLogo(sil, 32)), 32, 1).toBuffer() },
  { lado: 48, png: await pintar(cortar(coberturaDaLogo(sil, 48)), 48, 1).toBuffer() },
];
writeFileSync("public/favicon.ico", montarIco(ico));

// 180 nao e multiplo de 36, entao pinto 36x5=180 sem margem: exato.
await pintar(cortar(coberturaDaLogo(sil, 36)), 36, 5).toFile("public/apple-touch-icon.png");

console.log("Gerados: public/favicon.ico (a logo em 16/32/48) e public/apple-touch-icon.png (180x180)");
