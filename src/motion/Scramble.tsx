import { ElementType, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

// Embaralhamento a la Locomotive: cada caractere passa por glifos aleatorios
// e assenta da esquerda pra direita, elegante. Fonte e cor herdadas (nada de
// phosphor: azul e so acento). Texto final sempre no DOM (sr-only).
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▚▞░▒▓█/\\";

interface ScrambleProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  /** dispara ao entrar na viewport (default) ou no mount */
  onMount?: boolean;
}

const Scramble = ({ text, as: Tag = "span", className, delay = 0, duration = 720, onMount = false }: ScrambleProps) => {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      const t0 = performance.now() + delay;
      interval = setInterval(() => {
        const p = (performance.now() - t0) / duration;
        if (p >= 1) {
          setDisplay(text);
          clearInterval(interval);
          return;
        }
        if (p < 0) return;
        const settled = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i += 1) {
          if (i < settled || text[i] === " ") out += text[i];
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setDisplay(out);
      }, 45);
    };

    if (onMount) {
      start();
    } else {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        start();
      }, { threshold: 0.4 });
      io.observe(el);
      return () => {
        io.disconnect();
        if (interval) clearInterval(interval);
      };
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, delay, duration, onMount]);

  return (
    <Tag ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
};

export default Scramble;
