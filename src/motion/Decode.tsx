import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

const GLYPHS = "▓▒░<>/\\|#@%&$*+=~";

interface DecodeProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Decode/scramble (Secao 5.3): caracteres aleatorios que assentam no texto
 * final, da esquerda pra direita. A assinatura textual; 1 ou 2 por tela.
 * Dispara quando entra na viewport. Texto real em sr-only.
 */
const Decode = ({ text, delay = 0, duration = 900, className }: DecodeProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now() + delay;
        interval = setInterval(() => {
          const t = (performance.now() - start) / duration;
          if (t >= 1) {
            setDisplay(text);
            clearInterval(interval);
            return;
          }
          if (t < 0) return;
          const settled = Math.floor(t * text.length);
          let out = text.slice(0, settled);
          for (let i = settled; i < text.length; i += 1) {
            out += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          setDisplay(out);
        }, 40);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden="true" className={className}>
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default Decode;
