// Gera a familia de icones a partir do Ban da logo (public/ban/ban-mark.png).
// Uso: npm i -D sharp && node scripts/gen-favicon.mjs
// (sharp e usado apenas para gerar estes arquivos; nao e dependencia de runtime.)
//
// A arte E a logo, reduzida com o mesmo metodo do gen-ban-assets.mjs: media por
// bloco e threshold 1-bit, sem dither e sem anti-alias. Deixar o navegador
// reduzir sozinho daria 120 tons de cinza, que e exatamente o que o projeto
// nao faz.
//
// A excecao e o 16px. Nesse tamanho a pata do Ban tem 1 pixel de largura e o
// vao entre elas tambem: testei limiar fixo de 0.20 a 0.35 e limiar adaptativo
// por faixa, e nenhum resolve (ou come a pata ou funde as quatro num borrao).
// Entao o 16 tem arte propria, desenhada na regua da grade de 32 (cabeca 30%,
// corpo 40%, pata 30%). Icone sempre teve arte a parte no tamanho pequeno: e
// para isso que o .ico carrega varios tamanhos.
import sharp from "sharp";
import { writeFileSync } from "fs";

const AZUL = [11, 44, 162]; // --phosphor (227 87% 34%), o mesmo PRIMARY do og
const PAPER = [255, 255, 255];
const FONTE = "public/ban/ban-mark.png";
const CORTE = 0.4; // mesmo espirito do THRESHOLD do gen-ban-assets

// Ban de perfil desenhado a mao. So para 16px (ver comentario do topo).
const BAN16 = [
  "..####..........",
  "#######.........",
  ".#####.....#####",
  "..#############.",
  "..#############.",
  "..#############.",
  "..############..",
  "...##.....##....",
  "...##.....##....",
  "...##.....##....",
];

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

// Reduz a silhueta pra uma grade de `cols`: media da cobertura por bloco e
// corta. Media (e nao amostragem) preserva a massa da forma.
const gradeDaLogo = (sil, cols) => {
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
      linha.push(n && soma / n > CORTE * 255 ? 1 : 0);
    }
    grade.push(linha);
  }
  return grade;
};

const daString = (linhas) => linhas.map((l) => [...l].map((c) => (c === "#" ? 1 : 0)));

// Pinta a grade centrada num quadro, em fator INTEIRO: sem resize, logo nitido.
const pintar = (grade, cols, escala, margem = 0) => {
  const lado = cols * escala + margem * 2;
  const buf = Buffer.alloc(lado * lado * 4);
  for (let i = 0; i < lado * lado; i += 1) buf.set([...AZUL, 255], i * 4);
  const topo = Math.floor((cols - grade.length) / 2);
  grade.forEach((linha, gy) => {
    linha.forEach((v, gx) => {
      if (!v) return;
      for (let y = 0; y < escala; y += 1) {
        for (let x = 0; x < escala; x += 1) {
          const px = margem + gx * escala + x;
          const py = margem + (topo + gy) * escala + y;
          buf.set([...PAPER, 255], (py * lado + px) * 4);
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
  { lado: 16, png: await pintar(daString(BAN16), 16, 1).toBuffer() },
  { lado: 32, png: await pintar(gradeDaLogo(sil, 32), 32, 1).toBuffer() },
  { lado: 48, png: await pintar(gradeDaLogo(sil, 48), 48, 1).toBuffer() },
];
writeFileSync("public/favicon.ico", montarIco(ico));

// 180 nao e multiplo de 36, entao pinto 36x5=180 sem margem: exato.
await pintar(gradeDaLogo(sil, 36), 36, 5).toFile("public/apple-touch-icon.png");

console.log("Gerados: public/favicon.ico (16 proprio, 32/48 da logo) e public/apple-touch-icon.png (180x180)");
