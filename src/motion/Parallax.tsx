import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./prefs";

interface ParallaxProps {
  children: ReactNode;
  /** deslocamento em % da altura (positivo = sobe mais devagar) */
  amount?: number;
  className?: string;
}

// Parallax preso ao scroll (scrub): a camada se move em velocidade diferente
// do conteudo. Desligado em reduced-motion.
const Parallax = ({ children, amount = 12, className }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default Parallax;
