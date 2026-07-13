import { ElementType, ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { prefersReducedMotion } from "./prefs";

interface LineRevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** atraso em s apos entrar na viewport */
  delay?: number;
}

/**
 * Reveal por linha (Secao 5.3): mascara subindo, stagger por linha,
 * disparado quando ~20% do elemento entra na viewport.
 * SSG-safe: o texto real esta no DOM; o split so roda no client.
 */
const LineReveal = ({ as: Tag = "div", className, children, delay = 0 }: LineRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    let split: SplitType | null = null;
    let tween: gsap.core.Tween | null = null;
    let cancelled = false;

    // Espera as fontes pra nao quebrar linha no lugar errado
    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = new SplitType(el, { types: "lines" });
      if (!split.lines || split.lines.length === 0) return;

      split.lines.forEach((line) => {
        const mask = document.createElement("div");
        mask.style.overflow = "hidden";
        line.parentNode?.insertBefore(mask, line);
        mask.appendChild(line);
      });

      tween = gsap.fromTo(
        split.lines,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 0.64,
          ease: "expo.out",
          stagger: 0.08,
          delay,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    });

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default LineReveal;
