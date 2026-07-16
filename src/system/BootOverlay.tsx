import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/motion/prefs";

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
const BOOT_MS = 3000;

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

    const done = setTimeout(() => setPronto(true), BOOT_MS + 300);
    const sair = setTimeout(() => setOff(true), BOOT_MS + 1050);
    const remove = setTimeout(() => setVisible(false), BOOT_MS + 1050 + 600);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progTimer);
      clearTimeout(done);
      clearTimeout(sair);
      clearTimeout(remove);
    };
  }, []);

  if (!visible) return null;

  const frac = prog / CELLS;
  const pct = Math.round(frac * 100);

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
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-paper/60">estúdio de web e experiências</p>
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
              {"█".repeat(prog)}{"·".repeat(CELLS - prog)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootOverlay;
