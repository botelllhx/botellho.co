import * as THREE from "three";

// A tela do monitor, VIVA: um boot DOS rodando em loop, na mesma linguagem do
// BootOverlay do site (log linha a linha com leaders pontilhados + barra em
// blocos). Sai num CanvasTexture, entao e barato: redesenha ~12x/s, nao 60.
// Ela e a unica fonte de luz "acesa" do diorama — por isso importa que brilhe.
const LINHAS: [string, string][] = [
  ["sites e plataformas", "online"],
  ["experiencias 3d", "online"],
  ["direcao de arte", "carregada"],
  ["performance", "100/100"],
  ["acessibilidade", "wcag aa"],
];

const AZUL = "#0b2ca2";
const CLARO = "#dfe6ff";
const CELLS = 22;
const CICLO = 9; // segundos ate reiniciar o boot

export interface TelaViva {
  textura: THREE.CanvasTexture;
  desenhar: (t: number) => void;
  brilho: () => number;
}

export const criarTelaViva = (): TelaViva => {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 256;
  const ctx = cv.getContext("2d") as CanvasRenderingContext2D;

  const textura = new THREE.CanvasTexture(cv);
  textura.colorSpace = THREE.SRGBColorSpace;
  textura.flipY = false;
  textura.minFilter = THREE.LinearFilter;
  textura.magFilter = THREE.NearestFilter; // pixelado, combina com o passe retro

  let ultimo = -1;
  let luz = 1;

  const desenhar = (t: number) => {
    // ~12fps: a tela e um monitor velho, nao precisa de 60. E poupa CPU.
    const passo = Math.floor(t * 12);
    if (passo === ultimo) return;
    ultimo = passo;

    const ciclo = t % CICLO;
    ctx.fillStyle = AZUL;
    ctx.fillRect(0, 0, 512, 256);

    ctx.font = "20px monospace";
    ctx.textBaseline = "top";
    ctx.fillStyle = CLARO;
    ctx.fillText("botellho", 24, 20);

    // log revelando linha a linha, com leaders pontilhados
    const reveladas = Math.min(LINHAS.length, Math.floor(ciclo / 0.7));
    ctx.font = "16px monospace";
    for (let i = 0; i < reveladas; i++) {
      const [rot, val] = LINHAS[i];
      const y = 62 + i * 24;
      ctx.fillText(rot, 24, y);
      const x0 = 24 + ctx.measureText(rot).width + 8;
      const x1 = 488 - ctx.measureText(val).width - 8;
      for (let x = x0; x < x1; x += 8) ctx.fillText(".", x, y);
      ctx.fillText(val, x1, y);
    }

    // barra de progresso em blocos
    const p = Math.min(1, Math.max(0, (ciclo - 0.4) / 5.2));
    const cheias = Math.floor(p * CELLS);
    for (let i = 0; i < CELLS; i++) {
      ctx.fillStyle = i < cheias ? CLARO : "rgba(223,230,255,0.22)";
      ctx.fillRect(24 + i * 20, 196, 15, 18);
    }

    // cursor piscando quando termina
    if (p >= 1 && Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = CLARO;
      ctx.fillRect(24, 226, 10, 16);
    }

    // brilho pra luz da cena: pulsa junto com o preenchimento da barra
    luz = 0.75 + p * 0.35;
    textura.needsUpdate = true;
  };

  return { textura, desenhar, brilho: () => luz };
};
