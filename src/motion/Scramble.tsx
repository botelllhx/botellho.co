import { ElementType, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

// Embaralhamento a la Locomotive: SO letras. A palavra aparece desorganizada e
// cada letra trava no seu lugar. Suporta loop (re-embaralha sozinho, pra campos
// que animam o tempo todo) e modos de resolucao diferentes (ltr / aleatorio /
// centro), pra varias animacoes distintas convivendo. Layout estavel (copia
// invisivel reserva o espaco), texto final sempre no DOM (sr-only) pra SEO.
const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Mode = "ltr" | "random" | "center";

interface ScrambleProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  /** dispara ao entrar na viewport (default) ou no mount */
  onMount?: boolean;
  /** re-embaralha sozinho em loop */
  loop?: boolean;
  /** pausa entre um ciclo e outro (ms) */
  loopDelay?: number;
  /** ordem em que as letras travam */
  mode?: Mode;
}

const Scramble = ({ text, as: Tag = "span", className, delay = 0, duration = 900, onMount = false, loop = false, loopDelay = 2400, mode = "ltr" }: ScrambleProps) => {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let stopped = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    let loopTimer: ReturnType<typeof setTimeout> | undefined;

    const makeLock = () => {
      const len = text.length;
      const a: number[] = [];
      for (let i = 0; i < len; i += 1) {
        let base: number;
        if (mode === "random") base = Math.random();
        else if (mode === "center") {
          const half = (len - 1) / 2 || 1;
          base = (Math.abs(i - (len - 1) / 2) / half) * 0.7 + Math.random() * 0.35;
        } else base = (i / len) * 0.55 + Math.random() * 0.5;
        a.push(Math.min(0.985, base));
      }
      return a;
    };

    const run = (useDelay: boolean) => {
      if (stopped) return;
      const t0 = performance.now() + (useDelay ? delay : 0);
      const lock = makeLock();
      interval = setInterval(() => {
        const p = (performance.now() - t0) / duration;
        if (p >= 1) {
          setDisplay(text);
          if (interval) clearInterval(interval);
          if (loop && !stopped) loopTimer = setTimeout(() => run(false), loopDelay);
          return;
        }
        if (p < 0) return;
        let out = "";
        for (let i = 0; i < text.length; i += 1) {
          const ch = text[i];
          if (ch === " " || ch === "\n") out += ch;
          else if (p >= lock[i]) out += ch;
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setDisplay(out);
      }, 38);
    };

    let io: IntersectionObserver | undefined;
    if (onMount) {
      run(true);
    } else {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io?.disconnect();
        run(true);
      }, { threshold: 0.3 });
      io.observe(el);
    }

    return () => {
      stopped = true;
      io?.disconnect();
      if (interval) clearInterval(interval);
      if (loopTimer) clearTimeout(loopTimer);
    };
  }, [text, delay, duration, onMount, loop, loopDelay, mode]);

  return (
    <Tag ref={ref} className={className} style={{ position: "relative" }}>
      <span aria-hidden="true" style={{ visibility: "hidden" }}>{text}</span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>{display}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
};

export default Scramble;
