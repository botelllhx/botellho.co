import { ElementType, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

// Embaralhamento a la Locomotive: SO letras. A palavra aparece desorganizada e
// cada letra trava no seu lugar. Suporta loop (re-embaralha sozinho), modos de
// resolucao diferentes e disparo imperativo via ref (para embaralhar so em
// eventos, tipo colisao). Layout estavel (copia invisivel reserva o espaco),
// texto final sempre no DOM (sr-only) pra SEO.
const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Mode = "ltr" | "random" | "center";

export interface ScrambleHandle {
  scramble: () => void;
}

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
  loopDelay?: number;
  mode?: Mode;
  /** nao dispara sozinho; so via ref.scramble() */
  manual?: boolean;
}

const Scramble = forwardRef<ScrambleHandle, ScrambleProps>(function Scramble(
  { text, as: Tag = "span", className, delay = 0, duration = 900, onMount = false, loop = false, loopDelay = 2400, mode = "ltr", manual = false },
  ref,
) {
  const elRef = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const state = useRef<{ interval?: ReturnType<typeof setInterval>; loopTimer?: ReturnType<typeof setTimeout>; stopped: boolean }>({ stopped: false });

  const makeLock = useCallback(() => {
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
  }, [text, mode]);

  const run = useCallback((useDelay: boolean, doLoop: boolean) => {
    const s = state.current;
    if (s.stopped) return;
    if (s.interval) clearInterval(s.interval);
    const t0 = performance.now() + (useDelay ? delay : 0);
    const lock = makeLock();
    s.interval = setInterval(() => {
      const p = (performance.now() - t0) / duration;
      if (p >= 1) {
        setDisplay(text);
        if (s.interval) clearInterval(s.interval);
        s.interval = undefined;
        if (doLoop && !s.stopped) s.loopTimer = setTimeout(() => run(false, true), loopDelay);
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
  }, [text, delay, duration, loopDelay, makeLock]);

  useImperativeHandle(ref, () => ({
    scramble: () => { if (!prefersReducedMotion()) run(false, false); },
  }), [run]);

  useEffect(() => {
    const s = state.current;
    s.stopped = false;
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    if (manual) {
      return () => {
        s.stopped = true;
        if (s.interval) clearInterval(s.interval);
        if (s.loopTimer) clearTimeout(s.loopTimer);
      };
    }
    const el = elRef.current;
    let io: IntersectionObserver | undefined;
    if (onMount) {
      run(true, loop);
    } else if (el) {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io?.disconnect();
        run(true, loop);
      }, { threshold: 0.3 });
      io.observe(el);
    }
    return () => {
      s.stopped = true;
      io?.disconnect();
      if (s.interval) clearInterval(s.interval);
      if (s.loopTimer) clearTimeout(s.loopTimer);
    };
  }, [text, onMount, loop, manual, run]);

  return (
    <Tag ref={elRef} className={className} style={{ position: "relative" }}>
      <span aria-hidden="true" style={{ visibility: "hidden" }}>{text}</span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>{display}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
});

export default Scramble;
