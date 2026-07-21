// Gera o card social (og-image) na estetica do site: azul de fósforo, o Ban da
// logo em 1-bit, o wordmark botellho e a moldura de terminal (a mesma linguagem
// da tela de boot). É o que aparece quando alguem compartilha botellho.com.
// Uso: npm i -D sharp && node scripts/gen-og-assets.mjs
// (sharp so pra gerar; nao e dependencia de runtime. A familia de icones sai do
// gen-favicon.mjs.)
import sharp from "sharp";

const W = 1200;
const H = 630;
const AZUL = "#0b2ca2"; // --phosphor
const PAPER = [246, 247, 251];

// O Ban da logo (ban-mark) em branco, com as bordas crisp (nearest), pra manter
// o aspecto pixelado do 1-bit em vez de borrar no downscale.
const banBranco = async (larguraAlvo) => {
  const { data, info } = await sharp("public/ban/ban-mark.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i += 1) {
    if (data[i * 4 + 3] > 128) {
      out[i * 4] = PAPER[0];
      out[i * 4 + 1] = PAPER[1];
      out[i * 4 + 2] = PAPER[2];
      out[i * 4 + 3] = 255;
    }
  }
  const altura = Math.round((larguraAlvo * info.height) / info.width);
  const buf = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize(larguraAlvo, altura, { kernel: "nearest" })
    .png()
    .toBuffer();
  return { buf, largura: larguraAlvo, altura };
};

const scanlines = `<pattern id="scan" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="1" y="2" fill="#ffffff" opacity="0.06"/>
  </pattern>`;

const cardSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>${scanlines}</defs>
  <rect width="${W}" height="${H}" fill="${AZUL}"/>
  <rect width="${W}" height="${H}" fill="url(#scan)"/>

  <line x1="80" y1="98" x2="1120" y2="98" stroke="#ffffff" stroke-opacity="0.28"/>
  <text x="80" y="78" font-family="'DejaVu Sans Mono',monospace" font-size="22" letter-spacing="4" fill="#ffffff" fill-opacity="0.6">BOTELLHO MICROSYSTEMS</text>
  <text x="1120" y="78" text-anchor="end" font-family="'DejaVu Sans Mono',monospace" font-size="22" letter-spacing="4" fill="#ffffff" fill-opacity="0.6">BIOS V2.6</text>

  <text x="80" y="250" font-family="'DejaVu Sans Mono',monospace" font-size="24" letter-spacing="6" fill="#ffffff" fill-opacity="0.6">DESENVOLVEDOR CRIATIVO</text>
  <text x="74" y="392" font-family="Arial,'Liberation Sans',sans-serif" font-size="150" font-weight="900" letter-spacing="-7" fill="#ffffff">botellho</text>
  <text x="80" y="466" font-family="'DejaVu Sans Mono',monospace" font-size="30" fill="#ffffff" fill-opacity="0.9">Mateus Botelho</text>
  <text x="80" y="508" font-family="'DejaVu Sans Mono',monospace" font-size="24" fill="#ffffff" fill-opacity="0.55">web, 3D e direção de arte</text>

  <line x1="80" y1="556" x2="1120" y2="556" stroke="#ffffff" stroke-opacity="0.28"/>
  <text x="80" y="590" font-family="'DejaVu Sans Mono',monospace" font-size="24" letter-spacing="3" fill="#ffffff" fill-opacity="0.85">botellho.com</text>
</svg>`;

const ban = await banBranco(430);
await sharp(Buffer.from(cardSvg))
  .composite([{ input: ban.buf, left: W - ban.largura - 64, top: Math.round((H - ban.altura) / 2) }])
  .jpeg({ quality: 92 })
  .toFile("public/og-image.jpg");

console.log("Gerado: public/og-image.jpg (1200x630)");
