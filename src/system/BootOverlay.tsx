import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/motion/prefs";

// Boot do terminal (Secao 5.2): so na primeira visita da sessao, flag em
// memoria de runtime (sem browser storage). Overlay: cobre, nao bloqueia o
// LCP do conteudo real por baixo. Reduced-motion: nao ha boot.
let booted = false;

const LINES = [
  "> botellho.sys",
  "> vídeo: fósforo azul .......... ok",
  "> fontes: geomini + departure mono ok",
  "> interface: carregando",
];

const CELLS = 22;
const BOOT_MS = 1500;

const BootOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [shownLines, setShownLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (booted || prefersReducedMotion()) {
      booted = true;
      return;
    }
    booted = true;
    setVisible(true);

    const lineTimer = setInterval(() => {
      setShownLines((n) => Math.min(n + 1, LINES.length));
    }, 180);

    const start = performance.now();
    const progressTimer = setInterval(() => {
      const t = Math.min((performance.now() - start) / BOOT_MS, 1);
      setProgress(Math.floor(t * CELLS));
      if (t >= 1) clearInterval(progressTimer);
    }, 66);

    const exitTimer = setTimeout(() => setLeaving(true), BOOT_MS + 200);
    const removeTimer = setTimeout(() => setVisible(false), BOOT_MS + 200 + 400);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-end bg-background transition-opacity duration-[400ms]"
      style={{ opacity: leaving ? 0 : 1 }}
    >
      <div className="p-6 md:p-10">
        {LINES.slice(0, shownLines).map((line) => (
          <p key={line} className="type-dos text-sm leading-6 text-phosphor md:text-base">
            {line}
          </p>
        ))}
        <p className="type-dos mt-4 text-sm text-phosphor md:text-base">
          [{"▓".repeat(progress)}{"░".repeat(CELLS - progress)}]
        </p>
      </div>
    </div>
  );
};

export default BootOverlay;
