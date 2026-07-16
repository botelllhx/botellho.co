import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

interface TypingProps {
  text: string;
  className?: string;
  /** caracteres por segundo */
  speed?: number;
  delay?: number;
  caret?: boolean;
}

/**
 * Typing (Secao 5.3): caret digitando, para rotulos de terminal e campos
 * do contato. Dispara ao entrar na viewport; texto real em sr-only.
 */
const Typing = ({ text, className, speed = 28, delay = 0, caret = true }: TypingProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);
  const [done, setDone] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown("");
        setDone(false);
        let i = 0;
        timeout = setTimeout(() => {
          interval = setInterval(() => {
            i += 1;
            setShown(text.slice(0, i));
            if (i >= text.length) {
              clearInterval(interval);
              setDone(true);
            }
          }, 1000 / speed);
        }, delay);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [text, speed, delay]);

  return (
    <span ref={ref} className={`${className ?? ""} ${caret && !done ? "caret" : ""}`}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default Typing;
