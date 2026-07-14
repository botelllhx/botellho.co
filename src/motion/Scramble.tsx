import { ElementType, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

// Embaralhamento a la Locomotive: SO letras (nada de codigo/simbolos). A
// palavra aparece desorganizada e cada letra trava no seu lugar num tempo
// levemente aleatorio, dando a sensacao de se organizar. Layout estavel (uma
// copia invisivel reserva o espaco final, o texto embaralhado fica por cima),
// entao nada reflui. Texto final sempre no DOM (sr-only) pra SEO.
const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface ScrambleProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  /** dispara ao entrar na viewport (default) ou no mount */
  onMount?: boolean;
}

const Scramble = ({ text, as: Tag = "span", className, delay = 0, duration = 900, onMount = false }: ScrambleProps) => {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const run = () => {
      const t0 = performance.now() + delay;
      const len = text.length;
      // cada letra trava num ponto proprio: leve vies esquerda-pra-direita com
      // jitter, entao a palavra parece se organizar em vez de um wipe reto.
      const lock: number[] = [];
      for (let i = 0; i < len; i += 1) lock.push(Math.min(0.985, (i / len) * 0.55 + Math.random() * 0.5));
      interval = setInterval(() => {
        const p = (performance.now() - t0) / duration;
        if (p >= 1) {
          setDisplay(text);
          clearInterval(interval);
          return;
        }
        if (p < 0) return;
        let out = "";
        for (let i = 0; i < len; i += 1) {
          const ch = text[i];
          if (ch === " " || ch === "\n") out += ch;
          else if (p >= lock[i]) out += ch;
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setDisplay(out);
      }, 38);
    };

    if (onMount) {
      run();
      return () => {
        if (interval) clearInterval(interval);
      };
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      run();
    }, { threshold: 0.3 });
    io.observe(el);
    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text, delay, duration, onMount]);

  return (
    <Tag ref={ref} className={className} style={{ position: "relative" }}>
      <span aria-hidden="true" style={{ visibility: "hidden" }}>{text}</span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>{display}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
};

export default Scramble;
