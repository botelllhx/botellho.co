import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

interface SignalTextProps {
  text: string;
  delay?: number;
  className?: string;
}

/**
 * CRT signal-lock para uma palavra-chave: o sinal chega ruidoso (flicker de
 * opacidade e jitter) e trava no texto. Substitui o scramble de caracteres.
 * Dispara ao entrar na viewport; texto real sempre no DOM (sem sr-only,
 * porque o conteudo final nunca muda, so pisca).
 */
const SignalText = ({ text, delay = 0, className }: SignalTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timeout = setTimeout(() => {
          setLocked(false);
          const start = performance.now();
          const tune = () => {
            const t = (performance.now() - start) / 620;
            if (t >= 1) {
              el.style.opacity = "1";
              el.style.transform = "none";
              el.style.filter = "none";
              setLocked(true);
              return;
            }
            // ruido decrescente ate travar
            const noise = (1 - t) * (Math.sin(t * 60) * 0.5 + 0.5);
            el.style.opacity = String(0.35 + Math.random() * 0.65 * (1 - t) + t * 0.65);
            el.style.transform = `translateX(${(Math.random() - 0.5) * 6 * (1 - t)}px)`;
            el.style.filter = `brightness(${1 + noise * 1.6})`;
            frame = requestAnimationFrame(tune);
          };
          frame = requestAnimationFrame(tune);
        }, delay);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      if (timeout) clearTimeout(timeout);
    };
  }, [delay]);

  return (
    <span ref={ref} className={className} style={locked ? undefined : { display: "inline-block" }}>
      {text}
    </span>
  );
};

export default SignalText;
