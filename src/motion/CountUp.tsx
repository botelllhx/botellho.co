import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./prefs";

interface CountUpProps {
  to: number;
  suffix?: string;
  className?: string;
}

// Count-up ao entrar na viewport. Reduced-motion mostra o valor final.
const CountUp = ({ to, suffix = "", className }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(prefersReducedMotion() ? to : 0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = () => {
          const t = Math.min((performance.now() - start) / 1100, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * to));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
};

export default CountUp;
