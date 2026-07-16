import * as THREE from "three";

// A tela do monitor, VIVA: um pequeno sistema operacional fake rodando em loop,
// na linguagem do BootOverlay do site. Sai num CanvasTexture, entao e barato:
// redesenha ~12x/s, nao 60. Sao tres "programas" que se revezam, pra a tela nao
// virar um loop de 9s obvio: boot -> gráfico -> ban ASCII.
const AZUL = "#0b2ca2";
const CLARO = "#dfe6ff";
const MEIO = "rgba(223,230,255,0.30)";

const LINHAS: [string, string][] = [
  ["sites e plataformas", "online"],
  ["experiencias 3d", "online"],
  ["direcao de arte", "carregada"],
  ["performance", "100/100"],
  ["acessibilidade", "wcag aa"],
];

// O Ban em ASCII: gerado a partir da arte que o Mateus passou (130x46),
// reamostrada pra 78 colunas preservando a proporcao — a fonte do canvas e
// ~1.9x mais alta que larga, entao o passo vertical compensa isso.
const BAN_ASCII = [
  "          -+**######*+- :",
  "       :#%%%@@@%@@%%%@@@@%#+-",
  "    -=*#%@@%@@@@@##@@@@@@@@@%%+=:",
  "-+*%%%#***++**+*#*+*@@@@@@@%*%@@%#=",
  ":*%@@@%%***#*+++#%@@@@@@@@@@@%+*+**--::----++***#######****+=-",
  "    --==----:-++**@@@@@@@@@@@@@@@@@@@@%@@%%%%#%@@@@@@@@@@@@%%@@@#+:",
  "                -#%@@@@@@@@@@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*",
  "                 *@@@@@@@@@@@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@%@@@@@%+:",
  "                 +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%###*#@@@@@@@%*##%#+=-:",
  "                  #%@@@@%%%#%#**@@@@@@@@@@@@%*==-=@%%#%%#-  -+#%%@%%@@:   :-=-",
  "                 =@@@@@@%#%@@@@@@@@@@@@%#+-:         -*#%%*        ##%:",
  "               -+***++-      :---*@@@@#:             -+*+=:        ***+",
  "           --=**#*+-            :+%#**:           +###*+           -++-",
  "         =*#%***=::::::::::::::=##%#*=",
];

const CICLO = 24; // segundos do ciclo inteiro (3 programas de 8s)
const PROG = 8;

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

  const cabecalho = (titulo: string, t: number) => {
    ctx.fillStyle = CLARO;
    ctx.font = "18px monospace";
    ctx.fillText(titulo, 22, 16);
    // cursor piscando na barra de titulo
    if (Math.floor(t * 2) % 2 === 0) ctx.fillRect(22 + ctx.measureText(titulo).width + 6, 16, 9, 15);
    ctx.fillStyle = MEIO;
    ctx.fillRect(22, 40, 468, 1);
  };

  // 1) boot: log com leaders pontilhados + barra em blocos
  const boot = (u: number, t: number) => {
    cabecalho("botellho :: boot", t);
    ctx.font = "15px monospace";
    const n = Math.min(LINHAS.length, Math.floor(u * PROG / 0.8));
    for (let i = 0; i < n; i++) {
      const [rot, val] = LINHAS[i];
      const y = 58 + i * 22;
      ctx.fillStyle = CLARO;
      ctx.fillText(rot, 22, y);
      const x0 = 22 + ctx.measureText(rot).width + 6;
      const x1 = 490 - ctx.measureText(val).width;
      ctx.fillStyle = MEIO;
      for (let x = x0; x < x1 - 4; x += 7) ctx.fillText(".", x, y);
      ctx.fillStyle = CLARO;
      ctx.fillText(val, x1, y);
    }
    const p = Math.min(1, Math.max(0, (u * PROG - 0.4) / 4.6));
    for (let i = 0; i < 22; i++) {
      ctx.fillStyle = i < Math.floor(p * 22) ? CLARO : MEIO;
      ctx.fillRect(22 + i * 21, 196, 16, 18);
    }
    return 0.75 + p * 0.35;
  };

  // 2) grafico de barras "subindo": leitura de estudio trabalhando
  const grafico = (u: number, t: number) => {
    cabecalho("botellho :: build", t);
    const N = 16;
    for (let i = 0; i < N; i++) {
      // cada barra tem sua propria onda, entao o grafico nunca repete igual
      const h = (0.35 + 0.65 * Math.abs(Math.sin(t * 1.1 + i * 0.7))) * (0.3 + 0.7 * Math.min(1, u * 3));
      const alt = Math.round(h * 130);
      ctx.fillStyle = i % 2 === 0 ? CLARO : MEIO;
      ctx.fillRect(24 + i * 29, 200 - alt, 20, alt);
    }
    ctx.fillStyle = MEIO;
    ctx.fillRect(22, 202, 468, 1);
    ctx.fillStyle = CLARO;
    ctx.font = "13px monospace";
    ctx.fillText("frames/s ......... 60", 22, 222);
    return 0.8 + 0.3 * Math.abs(Math.sin(t * 1.1));
  };

  // 3) o Ban em ASCII, digitando linha a linha
  const banAscii = (u: number, t: number) => {
    cabecalho("botellho :: ban.exe", t);
    ctx.font = "11px monospace";
    ctx.fillStyle = CLARO;
    const n = Math.min(BAN_ASCII.length, Math.floor((u * PROG) / 0.3));
    for (let i = 0; i < n; i++) ctx.fillText(BAN_ASCII[i], 26, 62 + i * 12);
    if (n >= BAN_ASCII.length) {
      ctx.font = "12px monospace";
      ctx.fillText("ban, o salsicha // mascote", 26, 232);
    }
    return 0.85;
  };

  const desenhar = (t: number) => {
    // ~12fps: a tela e um monitor velho, nao precisa de 60. E poupa CPU.
    const passo = Math.floor(t * 12);
    if (passo === ultimo) return;
    ultimo = passo;

    const c = t % CICLO;
    const qual = Math.floor(c / PROG); // 0,1,2
    const u = (c % PROG) / PROG; // 0..1 dentro do programa

    ctx.fillStyle = AZUL;
    ctx.fillRect(0, 0, 512, 256);
    ctx.textBaseline = "top";

    luz = qual === 0 ? boot(u, t) : qual === 1 ? grafico(u, t) : banAscii(u, t);

    // troca de programa: um flash de tubo, como quem muda de canal
    if (u > 0.94) {
      ctx.fillStyle = `rgba(223,230,255,${(u - 0.94) / 0.06 * 0.85})`;
      ctx.fillRect(0, 0, 512, 256);
      luz = 1.4;
    }
    textura.needsUpdate = true;
  };

  return { textura, desenhar, brilho: () => luz };
};
