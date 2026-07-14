import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/motion/prefs";

// Boot DOS como primeira impressao da marca: tela azul, log revelando linha a
// linha com leaders pontilhados, o Ban acordando por scanline e uma barra em
// blocos. Sem spinner, sem jargao. So na primeira visita da sessao (flag em
// memoria, sem browser storage). Sai subindo, revelando o site.
let booted = false;

const LINHAS = [
  { l: "processador", v: "craft ×2" },
  { l: "memória", v: "640K ok" },
  { l: "vídeo", v: "1-bit ok" },
  { l: "entrada", v: "mouse · scroll" },
  { l: "ban", v: "acordando ✓" },
  { l: "módulos", v: "web · 3d · motion" },
];

const CELLS = 24;
const BOOT_MS = 1900;

const BootOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [off, setOff] = useState(false);
  const [linhas, setLinhas] = useState(0);
  const [prog, setProg] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (booted || prefersReducedMotion()) {
      booted = true;
      return;
    }
    booted = true;
    setVisible(true);

    const lineTimer = setInterval(() => setLinhas((n) => Math.min(n + 1, LINHAS.length)), 230);
    const start = performance.now();
    const progTimer = setInterval(() => {
      const t = Math.min((performance.now() - start) / BOOT_MS, 1);
      setProg(Math.floor(t * CELLS));
      if (t >= 1) clearInterval(progTimer);
    }, 55);

    const done = setTimeout(() => setPronto(true), BOOT_MS + 120);
    const sair = setTimeout(() => setOff(true), BOOT_MS + 520);
    const remove = setTimeout(() => setVisible(false), BOOT_MS + 520 + 580);

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

      <div className="relative mx-auto flex h-full max-w-xl flex-col justify-center gap-9 px-6">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-paper/60">
          <span>botellho microsystems</span>
          <span>bios v2.6</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="boot__ban">
            <img
              src="/ban/ban-1.png"
              alt=""
              className="boot__ban-img invert"
              style={{ clipPath: `inset(0 0 ${Math.max(0, (1 - frac) * 100)}% 0)` }}
            />
            <span className="boot__scan" style={{ top: `${Math.min(100, frac * 100)}%` }} />
          </div>
          <div className="leading-none">
            <span className="font-display text-4xl">botellho<span className="text-paper/50">▪</span></span>
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-paper/60">estúdio de web e experiências</p>
          </div>
        </div>

        <div className="space-y-1.5 text-sm">
          {LINHAS.slice(0, linhas).map((ln) => (
            <div key={ln.l} className="boot__line flex items-baseline gap-2">
              <span className="text-paper/85">{ln.l}</span>
              <span className="mb-1 flex-1 border-b border-dotted border-paper/30" />
              <span className="text-paper">{ln.v}</span>
            </div>
          ))}
        </div>

        <div className="text-sm">
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
  );
};

export default BootOverlay;
