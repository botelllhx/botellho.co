import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/motion/prefs";

// Boot da maquina (loader como peca de marca): power-on de CRT, o Ban
// montando por scanline dithered, log de boot em bitmap e barra 1-bit.
// So na primeira visita da sessao (flag em memoria; sem browser storage).
let booted = false;

const LINES = [
  "botellho BIOS v2.6",
  "memória ...................... 640K ok",
  "vídeo: fósforo azul .......... ok",
  "carregando ban ............... ok",
  "interface .................... ok",
];

const CELLS = 20;
const BOOT_MS = 2000;

const BootOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"on" | "boot" | "off">("on");
  const [lines, setLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (booted || prefersReducedMotion()) {
      booted = true;
      return;
    }
    booted = true;
    setVisible(true);

    const toBoot = setTimeout(() => setPhase("boot"), 260);
    const lineTimer = setInterval(
      () => setLines((n) => Math.min(n + 1, LINES.length)),
      360,
    );
    const start = performance.now();
    const progressTimer = setInterval(() => {
      const t = Math.min((performance.now() - start) / BOOT_MS, 1);
      setProgress(Math.floor(t * CELLS));
      if (t >= 1) clearInterval(progressTimer);
    }, 60);

    const off = setTimeout(() => setPhase("off"), BOOT_MS + 300);
    const remove = setTimeout(() => setVisible(false), BOOT_MS + 300 + 360);

    return () => {
      clearTimeout(toBoot);
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      clearTimeout(off);
      clearTimeout(remove);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`boot boot--${phase}`} aria-hidden>
      <div className="boot__crt">
        <div className="boot__scanlines" />

        <div className="boot__ban">
          <img
            src="/ban/ban-1.png"
            alt=""
            className="boot__ban-img invert"
            style={{ clipPath: `inset(${Math.max(0, 100 - progress * 5.4)}% 0 0 0)`, imageRendering: "pixelated" }}
          />
          <span className="boot__scan" style={{ top: `${Math.min(100, progress * 5.4)}%` }} />
        </div>

        <div className="boot__log">
          {LINES.slice(0, lines).map((line) => (
            <p key={line} className="boot__line type-dos">
              {line}
            </p>
          ))}
          <p className="boot__bar type-dos">
            [{"█".repeat(progress)}{"·".repeat(CELLS - progress)}]
          </p>
        </div>
      </div>
    </div>
  );
};

export default BootOverlay;
