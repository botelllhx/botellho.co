// Gera o card social (og-image) a partir de SVG.
// Uso: npm i -D sharp && node scripts/gen-og-assets.mjs
// (sharp e usado apenas para gerar estes arquivos; nao e dependencia de runtime.)
// A familia de icones (favicon.ico e apple-touch-icon) sai do gen-favicon.mjs,
// que e o dono do Ban 1-bit.
import sharp from "sharp";

const BG = "#0d0d0d";
const FG = "#fafafa";
const PRIMARY = "#0b2ca2";

const ogSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="0" y="0" width="1200" height="10" fill="${PRIMARY}"/>
  <g stroke="${PRIMARY}" fill="none" stroke-width="2" opacity="0.55">
    <rect x="900" y="120" width="240" height="240"/>
    <rect x="940" y="160" width="160" height="160"/>
    <rect x="980" y="200" width="80" height="80"/>
  </g>
  <text x="90" y="150" font-family="Arial, sans-serif" font-size="26" fill="${PRIMARY}" letter-spacing="6" font-weight="700">ESTÚDIO DE WEB E EXPERIÊNCIAS DIGITAIS</text>
  <text x="84" y="335" font-family="Arial, sans-serif" font-size="172" fill="${FG}" font-weight="800" letter-spacing="-6">botellho<tspan fill="${PRIMARY}">.</tspan></text>
  <text x="90" y="432" font-family="Arial, sans-serif" font-size="38" fill="${FG}" fill-opacity="0.72">Sites e experiências digitais para instituições</text>
  <text x="90" y="486" font-family="Arial, sans-serif" font-size="38" fill="${FG}" fill-opacity="0.72">que querem ser lembradas.</text>
  <text x="90" y="576" font-family="Arial, sans-serif" font-size="26" fill="${FG}" fill-opacity="0.5" letter-spacing="2" font-weight="700">botellho.com</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).jpeg({ quality: 90 }).toFile("public/og-image.jpg");

console.log("Gerado: public/og-image.jpg (1200x630)");
