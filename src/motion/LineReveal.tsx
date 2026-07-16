import { ElementType, ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { prefersReducedMotion } from "./prefs";

interface LineRevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
}

/**
 * Signal-lock por linha (a maquina sintoniza o texto): cada linha entra
 * cortada e com brilho estourado, pisca em steps e trava. Substitui a
 * reveal por mascara generica. Disparado a ~20% na viewport.
 * SSG-safe: o texto real esta no DOM; o efeito so roda no client.
 */
const LineReveal = ({ as: Tag = "div", className, children, delay = 0 }: LineRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    let split: SplitType | null = null;
    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      split = new SplitType(el, { types: "lines" });
      const lines = split.lines;
      if (!lines || lines.length === 0) return;

      gsap.set(lines, { opacity: 0 });
      tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
      lines.forEach((line, i) => {
        tl!.to(
          line,
          {
            keyframes: {
              opacity: [0, 1, 0.2, 1, 0.5, 1],
              filter: ["brightness(3)", "brightness(1.6)", "brightness(1)"],
              x: [-4, 2, 0],
            },
            duration: 0.42,
            ease: "steps(6)",
          },
          i * 0.09,
        );
      });
    });

    return () => {
      cancelled = true;
      tl?.scrollTrigger?.kill();
      tl?.kill();
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
