import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/motion/prefs";
import { aoHeroPronto, heroJaPronto, heroRegistrado } from "@/system/heroPronto";

// Boot DOS como primeira impressao da marca: tela azul, log revelando linha a
// linha com leaders pontilhados, o Ban acordando por scanline e uma barra em
// blocos. Sem spinner, sem jargao. So na primeira visita da sessao (flag em
// memoria, sem browser storage). Sai subindo, revelando o site.
//
// O estado inicial e `visible = true` DE PROPOSITO: o site e SSG, entao o
// navegador pinta o HTML pronto antes de qualquer JS rodar. Se o boot so
// ligasse no useEffect (que so roda depois da hidratacao), o site inteiro
// apareceria primeiro e o boot cairia por cima depois, que e o oposto do que um
// loader faz. Nascendo visivel, ele ja vem no HTML estatico e cobre desde o
// primeiro frame.
//
// Quem pediu menos movimento nao ve o boot, e isso e resolvido no CSS
// (.boot { display: none }) e nao aqui: CSS vale na primeira pintura, JS nao,
// e mudar o estado inicial no cliente quebraria a hidratacao.
let booted = false;

// Log com cara de boot, mas puxando pro que a gente vende (desenvolvimento de
// sites e experiencias), com sinais concretos de marketing nos valores.
const LINHAS = [
  { l: "sites e plataformas", v: "online" },
  { l: "experiências 3d e webgl", v: "online" },
  { l: "direção de arte", v: "carregada" },
  { l: "performance e seo", v: "100/100" },
  { l: "acessibilidade", v: "wcag aa" },
];

const CELLS = 24;
// Tempo da vinheta: e o que revela o Ban e enche a barra.
const BOOT_MS = 3000;
// Minimo em tela, com um respiro depois da barra encher. So depois disto o boot
// olha se tem 3D pra esperar.
const MINIMO_MS = BOOT_MS + 300;
// Teto contado do inicio: rede ruim ou GLB que nao chega nao podem prender
// ninguem numa tela azul.
const TETO_MS = 8000;

const BootOverlay = () => {
  // `!booted` e igual no servidor e no cliente na primeira carga (o modulo nasce
  // zerado), entao a hidratacao casa. Numa remontagem (ex.: voltar do /admin) ja
  // nasce false e o boot nao repete.
  const [visible, setVisible] = useState(() => !booted);
  const [off, setOff] = useState(false);
  const [linhas, setLinhas] = useState(0);
  const [prog, setProg] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (booted || prefersReducedMotion()) {
      booted = true;
      setVisible(false);
      return;
    }
    booted = true;

    const lineTimer = setInterval(() => setLinhas((n) => Math.min(n + 1, LINHAS.length)), 420);
    const start = performance.now();
    const progTimer = setInterval(() => {
      const t = Math.min((performance.now() - start) / BOOT_MS, 1);
      setProg(Math.floor(t * CELLS));
      if (t >= 1) clearInterval(progTimer);
    }, 60);

    // Fecha o boot: marca pronto, deixa a pessoa ler, e sobe revelando o site.
    let sair: ReturnType<typeof setTimeout>;
    let remove: ReturnType<typeof setTimeout>;
    let teto: ReturnType<typeof setTimeout>;
    let desinscrever = () => {};
    let fechado = false;
    const fechar = () => {
      if (fechado) return;
      fechado = true;
      desinscrever();
      clearTimeout(teto);
      setPronto(true);
      sair = setTimeout(() => setOff(true), 750);
      remove = setTimeout(() => setVisible(false), 750 + 600);
    };

    // Passado o minimo da vinheta: se nao ha 3D vindo nesta pagina, sobe. Se ha,
    // espera o primeiro frame do canvas. Sem isso o boot subia no meio do
    // download e o 3D pulava pra dentro com a tela ja aberta.
    const minimo = setTimeout(() => {
      if (!heroRegistrado() || heroJaPronto()) {
        fechar();
        return;
      }
      desinscrever = aoHeroPronto(fechar);
      teto = setTimeout(fechar, TETO_MS - MINIMO_MS);
    }, MINIMO_MS);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
      clearTimeout(minimo);
      clearTimeout(sair);
      clearTimeout(remove);
      clearTimeout(teto);
      desinscrever();
    };
  }, []);

  if (!visible) return null;

  // `frac` e a vinheta: revela o Ban ao longo do BOOT_MS.
  const frac = prog / CELLS;
  // A barra e o numero, porem, so fecham quando o hero esta MESMO pronto. Agora
  // que o boot espera de verdade, cravar 100% enquanto ainda carrega seria
  // mentira: segura no 99 ate ter o que mostrar.
  const cheio = pronto ? CELLS : Math.min(prog, CELLS - 1);
  const pct = pronto ? 100 : Math.min(99, Math.round(frac * 100));

  return (
    <div className={`boot ${off ? "boot--off" : ""}`} aria-hidden>
      <div className="boot__scanlines" />

      <div className="relative mx-auto flex h-full max-w-xl flex-col justify-center gap-6 px-6">
        <div className="flex items-center justify-between border-b border-paper/25 pb-3 text-xs uppercase tracking-[0.18em] text-paper/60">
          <span>botellho microsystems</span>
          <span>bios v2.6</span>
        </div>

        {/* identidade: Ban horizontal impresso da esquerda pra direita, wordmark abaixo */}
        <div>
          <img
            src="/ban/ban-mark.png"
            alt=""
            className="boot__ban-img invert h-20 w-auto"
            style={{ clipPath: `inset(0 ${Math.max(0, (1 - frac) * 100)}% 0 0)` }}
          />
          <div className="mt-5 leading-none">
            <span className="text-4xl md:text-5xl">botellho<span className="text-paper/50">▪</span></span>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-paper/60">mateus botelho · desenvolvedor criativo</p>
          </div>
        </div>

        <div className="space-y-5 border-t border-paper/25 pt-5 text-sm">
          <div className="space-y-1.5">
            {LINHAS.slice(0, linhas).map((ln) => (
              <div key={ln.l} className="boot__line flex items-baseline gap-2">
                <span className="text-paper/85">{ln.l}</span>
                <span className="mb-1 flex-1 border-b border-dotted border-paper/30" />
                <span className="text-paper">{ln.v}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between text-paper">
              <span className={pronto ? "boot__caret" : ""}>{pronto ? "pronto." : "carregando"}</span>
              <span className="tabular-nums text-paper/70">{pct}%</span>
            </div>
            <div className="mt-2 overflow-hidden tracking-[0.15em] text-paper" aria-hidden>
              {"█".repeat(cheio)}{"·".repeat(CELLS - cheio)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootOverlay;
